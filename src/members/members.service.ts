import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schema/members.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { response } from 'express';
import { ProjectsService } from 'src/projects/projects.service';
import { Project } from 'src/projects/schema/projects.schema';

@Injectable()
export class MembersService {

  constructor(@InjectModel('Member') private memberModel: Model<Member>, 
   private readonly projectService: ProjectsService) {};
  
  async create(createMemberDto: CreateMemberDto) { 
    const userData = await this.memberModel.create(createMemberDto);
    return userData;
  }

  async findAll() {
    return await this.memberModel.find().populate('projects');
  }

  async findOne(id: string) {
   const data = await this.memberModel.findById({_id : id}).populate('projects');
    return [data];
  }

  async update(id: string, updateMemberDto: UpdateMemberDto):Promise<Member> { 
   let {projects , ...updateData} = updateMemberDto
    const data =await this.memberModel.findByIdAndUpdate(id, {$set : updateData,$push : {projects}} ,{new:true})
    return data;
  }

  async remove(id: string) {
    const data = await this.memberModel.findByIdAndDelete({_id :id})
    return 'Member Deleted ';
  }
}
