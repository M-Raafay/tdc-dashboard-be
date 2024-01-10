import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/projects.schema';
import { Model } from 'mongoose';
import {
  memberRemovedFields,
  memberSelectFields,
  salesMemberRemovedFields,
  teamRemovedFields,
} from 'src/utils/removed_field';
import { MailerService } from 'src/mailer/mailer.service';
import { MembersService } from 'src/members/members.service';
import { Member } from 'src/members/schema/members.schema';
import { User } from 'src/utils/interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    @InjectModel('Member') private memberModel: Model<Member>,
    private memberService: MembersService,
    private readonly emailService: MailerService, // private readonly configService: ConfigService,
  ) {}

  async create(createProjectDto: CreateProjectDto, member: User) {
    const createdByData = await this.memberModel
      .findById(member._id)
      .select(memberSelectFields);

    const data: any = await this.projectModel.create({
      ...createProjectDto,
      createdBy: createdByData,
    });

    // If teams_assigned is not provided, assign members to members_assigned
    if (!createProjectDto.teams_assigned && createProjectDto.members_assigned) {
      data.members_assigned = createProjectDto.members_assigned;
      await data.save();
    }

    // const techLead = await this.memberService.findMemberById(createProjectDto.team_lead)
    // console.log(techLead);
    // if(!techLead)
    //   throw new NotFoundException('Tech_Lead not found')

    return data;
  }

  async findAll() {
    const data = await this.projectModel
      .find({})
      .populate('team_lead', memberRemovedFields)
      .populate('sales_coordinator', salesMemberRemovedFields)
      .populate('teams_assigned', memberRemovedFields)
      .populate('members_assigned', memberRemovedFields) // Populate members_assigned
      .populate('client')
      .exec();
    return data;
  }

  async findOne(id: string) {
    const data = await this.projectModel
      .findById(id)
      .populate('team_lead', memberRemovedFields)
      .populate('sales_coordinator', salesMemberRemovedFields)
      .populate('teams_assigned', memberRemovedFields)
      .populate('client')
      .populate('members_assigned', memberRemovedFields) // Populate members_assigned
      // .populate({  // Populate members_assigned with nested populate
      //   path: 'members_assigned',
      //   populate: {
      //     path: 'teams',
      //     model: 'Teams', // Specify the model for the nested population
      //     select: teamRemovedFields,
      //   },
      // })
      .exec();
    if (!data) {
      throw new NotFoundException('project not found');
    }
    return data;
  }

  //@Todo Update Dto to independent
  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const data = await this.projectModel.findByIdAndUpdate(
      id,
      { ...updateProjectDto },
      { new: true },
    );
    if (!data) {
      throw new NotFoundException('Project not found');
    }
    return data;
  }

  async remove(id: string) {
    await this.projectModel.findByIdAndDelete(id);
    return { message: 'Project Deleted' };
  }
}
