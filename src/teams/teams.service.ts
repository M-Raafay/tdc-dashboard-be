import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Teams } from './schema/teams.schema';
import { memberRemovedFields } from 'src/utils/removed_field';
import { Member } from 'src/members/schema/members.schema';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel('Teams') private teamsModel: Model<Teams>,
    @InjectModel('Member') private memberModel: Model<Member>,
  ) {}

  async create(createTeamDto: CreateTeamDto, user) {
    const teamCreated = await this.teamsModel.create({
      createdBy: user._id,
      ...createTeamDto,
    });
    //update team_head in members model and set is_teamHead to true
    await this.memberModel.findByIdAndUpdate(
      { _id: createTeamDto.team_head },
      { is_teamHead: true },
      { new: true },
    );
    //add team id to respective members(teams[] field) in document
    const memberIdArray = teamCreated.members;

    const teamUpdateQuery = { $addToSet: { teams: teamCreated._id } };

    await this.memberModel.updateMany(
      { _id: { $in: memberIdArray } },
      teamUpdateQuery,
    );
    return teamCreated;
  }

  async findAll() {
    return await this.teamsModel
      .find()
      .populate({
        path: 'department',
        populate: {
          path: 'departmentHead createdBy',
          select: memberRemovedFields,
        },
      })
      .populate({
        path: 'team_head',
        select: memberRemovedFields,
      })
      .populate({
        path: 'members',
        select: memberRemovedFields,
      });
  }

  async findOne(id: string) {
    try {
      const team = await this.teamsModel
        .findOne({
          _id: id,
        })
        .populate({
          path: 'department',
          populate: {
            path: 'departmentHead',
            select: memberRemovedFields,
          },
        })
        .populate('team_head', memberRemovedFields)
        .populate('members', memberRemovedFields)
        .populate('projects');
      if(!team){
        throw new NotFoundException('Team not found')
      }
      return team;
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    try {
      //remove previous team head and update team_head in members model and set is_teamHead to true
      const previousData = await this.teamsModel.findById({ _id: id });
      const newHeadId = new mongoose.Types.ObjectId(updateTeamDto.team_head);
      if (previousData.team_head !== newHeadId) {
        await this.memberModel.findByIdAndUpdate(
          { _id: previousData.team_head },
          { $set: { is_teamHead: false } },
          { new: true },
        );
        await this.memberModel.findByIdAndUpdate(
          { _id: updateTeamDto.team_head },
          { $set: { is_teamHead: true } },
          { new: true },
        );
      }
      //update team document
      const updatedTeam = await this.teamsModel.findByIdAndUpdate(
        id,
        { $set: updateTeamDto },
        { new: true },
      );
      //add team id to respective members(teams[] field) in document
      const memberIdArray = updatedTeam.members;
      const teamUpdateQuery = { $addToSet: { teams: updatedTeam._id } };
      await this.memberModel.updateMany(
        { _id: { $in: memberIdArray } },
        teamUpdateQuery,
      );
      const newMembers = memberIdArray.filter(
        (memberId) => !updatedTeam.members.includes(memberId),
      );
      if (newMembers.length > 0) {
        await this.memberModel.updateMany(
          { _id: { $in: newMembers } },
          { $addToSet: { teams: updatedTeam._id } },
        );
      }
      if (!updatedTeam) {
        throw new InternalServerErrorException('error updating department');
      }
      return updatedTeam;
    } catch (error) {
      throw error
    }
  }

  async remove(id: string) {
    try {
      // Find the team document to be deleted
      const deletedTeam = await this.teamsModel.findByIdAndDelete(id);
      if (!deletedTeam) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }

      // Remove the teamId from the respective members' documents
      const teamId = deletedTeam._id;
      const memberIdArray = deletedTeam.members;

      // Update the members' documents by pulling the teamId from the teams array in Memebers documents
      const teamUpdateQuery = { $pull: { teams: teamId } };
      await this.memberModel.updateMany(
        { _id: { $in: memberIdArray } },
        teamUpdateQuery,
      );

      return { message: `Team ${deletedTeam.name} deleted` };
    } catch (error) {
      throw error
    }
  }
}
