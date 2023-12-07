import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/projects.schema';
import { Model } from 'mongoose';
import { memberRemovedFields, salesMemberRemovedFields } from 'src/utils/removed_field';
import { MailerService } from 'src/mailer/mailer.service';
import { MembersService } from 'src/members/members.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel('Project') private projectModel: Model<Project>,
    private memberService: MembersService,
    private readonly emailService: MailerService,
  ) // private readonly configService: ConfigService,
  {}

  async create(createProjectDto: CreateProjectDto) {
    const data = await this.projectModel.create({ ...createProjectDto });
    const techLead = await this.memberService.findOneById(createProjectDto.team_lead)
    console.log(techLead);
    if(!techLead)
      throw new NotFoundException('Tech_Lead not found')
    

    return data;
  }

  async findAll() {
    const data = await this.projectModel
      .find({})
      .populate('team_lead', memberRemovedFields)
      .populate('sales_coordinator', salesMemberRemovedFields)
      .populate('resource_assigned', memberRemovedFields)
      .exec();
    return data;
  }

  async findOne(id: string) {
    const data = await this.projectModel
      .findById(id)
      .populate('resource_assigned');
    if (!data) {
      throw new HttpException('not found', 404);
    }
    return [data];
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    const data = await this.projectModel.findByIdAndUpdate(
      id,
      { ...updateProjectDto },
      { new: true },
    );
    return data;
  }

  async remove(id: string) {
    await this.projectModel.findByIdAndDelete(id);
    return { message: 'Project Deleted' };
  }
}
