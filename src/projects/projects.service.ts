import { HttpException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schema/projects.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProjectsService {
  
  constructor (@InjectModel('Project') private projectModel: Model<Project>){}

  async create(createProjectDto: CreateProjectDto) {
   const data= await this.projectModel.create({...createProjectDto});
   return data;
  }

  async findAll() {
    return this.projectModel.find();
  }

  async findOne(id: string) {
    const data = await this.projectModel.findById(id)
    if(!data){
      throw new HttpException('not found' , 404)
    }
    return [data];
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
   const data = await this.projectModel.findByIdAndUpdate(id,{...updateProjectDto},{new:true});
   return data;
  }

  async remove(id: string) {
    await this.projectModel.findByIdAndDelete(id);
    return 'Project Deleted'
  }
}
