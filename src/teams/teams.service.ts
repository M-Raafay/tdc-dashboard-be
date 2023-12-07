import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teams } from './schema/teams.schema';
import { memberRemovedFields } from 'src/utils/removed_field';

@Injectable()
export class TeamsService {
  constructor(@InjectModel('Teams') private teamsModel: Model<Teams>) {}

  async create(createTeamDto: CreateTeamDto, user) {
    const teamCreated = await this.teamsModel.create({
      createdBy: user._id,
      ...createTeamDto,
    });

    return teamCreated;
  }

  async findAll() {
    return await this.teamsModel
      .find()
      .populate({
        path: 'department',
        populate: {
          path: 'department_head createdBy',
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

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return `This action updates a #${id} team`;
  }

  remove(id: number) {
    return `This action removes a #${id} team`;
  }
}
