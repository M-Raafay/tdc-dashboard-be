import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Model } from 'mongoose';
import { Task } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { memberSelectFields } from 'src/utils/removed_field';
import { User } from 'src/utils/interface';
import { Member } from 'src/members/schema/members.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel('Task') private taskModel: Model<Task>,
    @InjectModel('Member') private memberModel: Model<Member>,
  ) {}
  async create(createTaskDto: CreateTaskDto, user: User) {
    try {
      console.log(user);
      
      const createdByData = await this.memberModel
        .findById(user._id)
        .select(memberSelectFields);
        console.log(createdByData);
        

      const taskCreated = await this.taskModel.create({
        createdBy: createdByData,
        ...createTaskDto,
      });

      return taskCreated;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while creating task ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const allTasks = await this.taskModel
        .find()
        .populate('lead')
        .populate('client')
        .populate('salesMember')
        .populate('taskSupervisor')
        .populate('taskTechResources');
      return allTasks;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while fetching departments ${error.message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const allTasks = await this.taskModel
        .find({ _id: id })
        .populate('lead')
        .populate('client')
        .populate('salesMember')
        .populate('taskSupervisor')
        .populate('taskTechResources');
      return allTasks;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while fetching departments ${error.message}`,
      );
    }
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    try {
      const updatedData = await this.taskModel.findByIdAndUpdate(
        id,
        { $set: updateTaskDto },
        { new: true },
      );

      if (!updatedData) {
        throw new InternalServerErrorException('Error updating task');
      }
      return updatedData;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async remove(id: string) {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(id);
      if (!deletedTask) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }

      return { message: `Task ${deletedTask.name} deleted` };
    } catch (error) {
      throw error;
    }
  }
}
