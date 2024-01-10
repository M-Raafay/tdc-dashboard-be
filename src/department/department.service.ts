import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Department } from './schema/department.schema';
import { memberRemovedFields, memberSelectFields, memberSelectFieldss } from 'src/utils/removed_field';
import { Member } from 'src/members/schema/members.schema';
import { NotFoundError } from 'rxjs';
import { User } from 'src/utils/interface';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectModel('Department') private departmentModel: Model<Department>,
    @InjectModel('Member') private memberModel: Model<Member>,
  ) {}
  async create(createDepartmentDto: CreateDepartmentDto, user :User) {
    try {

      const createdByData = await this.memberModel.findById(user._id).select(memberSelectFields);
      if (createDepartmentDto.departmentHead) {
        const memberHead = await this.memberModel.findByIdAndUpdate(
          { _id: createDepartmentDto.departmentHead },   
          { is_departmentHead: true },   // here same member can also be already departmenthead in any other department?
          { new: true },
        );

        if (!memberHead || !createdByData)
          throw new BadGatewayException('Member data does not exists');
      }
      const departmentCreated = await this.departmentModel.create({
        createdBy: createdByData,
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
        .populate('createdBy', memberSelectFields)
        .populate('departmentHead', memberSelectFields);
      return allDeprtments;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while fetching departments ${error.message}`,
      );
    }
  }

  async findOne(id: string) {
    try {
      const department = await this.departmentModel
        .findOne({
          _id: id,
        })
        .populate('departmentHead', memberSelectFields)
        .populate('createdBy', memberRemovedFields);
      if(!department){
        throw new NotFoundException('Department not found')
      }
      return department;
    } catch (error) {
      throw error
    }
  }

  async update(id: string, updateDepartmentDto: UpdateDepartmentDto) {
    try{
      const previousData = await this.departmentModel.findById({_id:id})
      if(!previousData){
        throw new BadRequestException('Error in request. Department/Head not found')
      }
      const newHeadId = new mongoose.Types.ObjectId(
        updateDepartmentDto.departmentHead,
      );
      if (previousData.departmentHead !== newHeadId) {
        await this.memberModel.findByIdAndUpdate(
          { _id: previousData.departmentHead },
          { $set: { is_departmentHead: false } },
          { new: true },
        );
        await this.memberModel.findByIdAndUpdate(
          { _id: updateDepartmentDto.departmentHead },
          { $set: { is_departmentHead: true } },
          { new: true },
        );
      }
    const updatedData = await this.departmentModel.findByIdAndUpdate(
      id,
      { $set: updateDepartmentDto },
      { new: true },
    );

    if(!updatedData){
      throw new InternalServerErrorException('Error updating department')
    }
    return updatedData;
  }catch(error){
    throw new InternalServerErrorException(
      `${error.message}`,
    );
    }
  }

  //@Todo throwing error when seting department head to false. due to attribute key change
  async remove(id: string) {
    try {
      const department = await this.departmentModel.findOneAndDelete({
        _id: id,
      });
      await this.memberModel.findByIdAndUpdate(
        { _id: department.departmentHead },
        { $set: { is_departmentHead: false } },
        { new: true },
      );

      return { message: `Department ${department.name} deleted` };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error occured while deleting department ${error.message}`,
      );
    }
  }
}
