import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Department } from './schema/department.schema';
import { memberRemovedFields } from 'src/utils/removed_field';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel('Department') private departmentModel: Model<Department>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto, user) {
    try {
      const departmentCreated = await this.departmentModel.create({
        createdBy: user._id,
        ...createDepartmentDto,
      });

      return departmentCreated;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while creating department ${error.message}`,
      );
    }
  }

  async findAll() {
    try {
      const allDeprtments = await this.departmentModel
        .find()
        .populate('department_head', memberRemovedFields)
        .populate('createdBy', memberRemovedFields);
      return allDeprtments;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while fetching departments ${error.message}`,
      );
    }
  }

  async findOne(id: number) {
    try {
      const department = await this.departmentModel.findOne({
        id: id,
      });
      return department;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while fetching department ${error.message}`,
      );
    }
  }

  update(id: number, updateDepartmentDto: UpdateDepartmentDto) {
    return `This action updates a #${id} department`;
  }

  async remove(id: number) {
    try {
      const department = await this.departmentModel.findByIdAndDelete({
        id:id
      });

      return {message: `Department ${department.name} deleted`};
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while deleting department ${error.message}`,
      );
    }
  }
}
