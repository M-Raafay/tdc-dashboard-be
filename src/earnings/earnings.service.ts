// src/earnings/earnings.service.ts

import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Earnings } from './schema/earnings.schema';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { Member } from 'src/members/schema/members.schema';
import { Department } from 'src/department/schema/department.schema';
import { Project } from 'src/projects/schema/projects.schema';
import { Teams } from 'src/teams/schema/teams.schema';
import { PayRoll } from 'src/pay-roll/schema/Payroll.schema';
import {
  departmentRemovedFields,
  memberSelectFields,
} from 'src/utils/removed_field';
import moment from 'moment';

@Injectable()
export class EarningsService {
  constructor(
    @InjectModel('Earnings') private readonly earningsModel: Model<Earnings>,
    @InjectModel('PayRoll') private payRollmodel: Model<PayRoll>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    @InjectModel('Department') private departmentModel: Model<Department>,
    @InjectModel('Project') private projectModel: Model<Project>,
    @InjectModel('Teams') private teamsModel: Model<Teams>,
    private configService: ConfigService,
  ) {}

  // TOdo: will work, it is efficient and automatically getting values from tables ----> pending, more we have ony extracted the projectsAssigned from project model table aginst a member, but we also have to extract the projectsWorkedOn against a member from Clockify Table, but clockify module is not generated so we have to wait for this
  async create(
    createEarningDto: CreateEarningDto,
  ): Promise<{ message: string; data: Earnings }> {
    try {
      const { member, department } = createEarningDto;

      // Validate that the referenced Member and Department exist
      const memberExist = await this.memberModel
        .findById({ _id: member })
        .exec();

      if (!memberExist) {
        throw new NotFoundException(`Member with ID ${member} not found`);
      }

      const departmentExist = await this.departmentModel
        .findById({ _id: department })
        .exec();

      if (!departmentExist) {
        throw new NotFoundException(
          `Department with ID ${department} not found`,
        );
      }

      const currentMonth = moment().format('MMMM');
      const month = currentMonth;
      const currentYear = parseInt(moment().format('YYYY'), 10); // Convert year to a number
      const year = currentYear;
      console.log('month: ',month);
      console.log('year: ',year);

      // Fetch the salary from the member model
      const memberExistSalary = await this.memberModel
        .findOne({ _id: member, isDeleted: false })
        .exec();
      if (!memberExistSalary) {
        throw new NotFoundException(
          `Member with ID ${member} not found or is deleted`,
        );
      }
      // Now, you can access the salary from the fetched member
      const currentSalary = memberExistSalary.currentSalary;

      console.log('currentSalary: ', currentSalary);

      // get contractedHours from env file
      const contractedHours = parseInt(
        this.configService.get('CONTRACTED_HOURS'),
        10,
      );
      console.log(
        'contractedHours:   ',
        typeof contractedHours,
        '    ',
        contractedHours,
      );

      let totalWorkedHours: number;
      // Case 1: If totalUnderTimeHours is greater than 0
      if (createEarningDto.totalUnderTimeHours > 0) {
        totalWorkedHours = Math.round(
          contractedHours - createEarningDto.totalUnderTimeHours,
        );
      }
      // Case 2: If totalOvertimeHours is greater than 0
      else if (createEarningDto.totalOvertimeHours > 0) {
        totalWorkedHours = Math.round(
          contractedHours + createEarningDto.totalOvertimeHours,
        );
      }
      // Case 3: If both totalUnderTimeHours and totalOvertimeHours are zero
      else {
        totalWorkedHours = contractedHours;
      }
      console.log('totalWorkedHours:   ', totalWorkedHours);

      const perHourRate = Math.round(currentSalary / contractedHours);
      console.log('perHourRate:   ', typeof perHourRate);

      const totalEarnings = Math.round(perHourRate * totalWorkedHours);
      console.log(
        'totalEarnings:   ',
        typeof totalEarnings,
        '   ',
        totalEarnings,
      );

      const netSalary = Math.round(
        totalEarnings - createEarningDto.totalDeductions,
      );
      console.log('netSalary:   ', typeof netSalary);
      // Validation: Invalid values for calculated fields
      if (totalWorkedHours < 0 || totalEarnings < 0 || netSalary < 0) {
        throw new BadRequestException('Invalid values for calculated fields');
      }
      console.log('test');
      // Check if earning for this month already exists
      const existingEarning = await this.earningsModel.findOne({
        member: createEarningDto.member,
        month: month,
        year: year,
      });
      console.log('test');

      if (existingEarning) {
        throw new ConflictException(
          'Earning for this month and year already exists for the member',
        );
      }

      // ------------- Extar functionality is adding here to get all projects assigned to a member -------------

      // Dynamically fetch assigned projects based on member ID
      const assignedProjects: any = await this.projectModel
        .find({
          members_assigned: { $in: [member] },
        })
        .select('name');

      // Extract project IDs and assigned team IDs
      const projectIds = assignedProjects.map((project) => project._id); // it is simple because we are running on projects ,odel collection in db
      console.log('projectIds:   ', projectIds);

      // Find teams where any of the member IDs exist in the members array
      const teamsWithMembers = await this.teamsModel
        .find({
          members: { $in: [member] },
        })
        .select('name');

      // Extract team IDs
      const teamIds = teamsWithMembers.map((team) => team._id);

      // Use team IDs to find projects
      const projectsOfMembers = await this.projectModel
        .find({
          teams_assigned: { $in: teamIds },
        })
        .select('name');
      console.log('projectsOfMembers:   ', projectsOfMembers);

      // Extract project IDs and assigned team IDs
      const projectIdsfromTeamModel = projectsOfMembers.map(
        (project) => project._id,
      ); // it is simple because we are running on projects ,odel collection in db
      console.log('projectIdsfromTeamModel:   ', projectIdsfromTeamModel);

      // Combine all project IDs and saving unique Ids and converting from object_id to string
      const allProjectIdsSet = new Set(
        [...projectIds, ...projectIdsfromTeamModel].map((id) => id.toString()),
      );
      console.log('allProjectIds:   ', allProjectIdsSet);

      // Convert Set back to array
      // const allProjectIds = Array.from(allProjectIdsSet);
      // Alternatively:
      const allProjectIds = [...allProjectIdsSet];

      console.log('allProjectIds:   ', allProjectIds);

      const createdEarnings = await (
        await this.earningsModel.create({
          month,
          year,
          contractedHours,
          currentSalary,
          perHourRate,
          totalWorkedHours,
          totalEarnings,
          netSalary,
          projectsAssigned: allProjectIds, // Store all assigned project IDs
          ...createEarningDto,
        })
      ).save();

      console.log('createdEarnings:  ', createdEarnings);

      // Save the calculated values to the database
      // return createdEarnings.save();
      return {
        message: `New Earnings created successfully for member ID ${member} in month ${month}`,
        data: createdEarnings,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findAll() {
    try {
      const earnings = await this.earningsModel
        .find()
        .populate('member', 'name email')
        .populate('department', 'name')
        .populate({
          path: 'projectsAssigned',
          model: 'Project', // Replace with the actual model name for Project
          select: 'name', // Specify the fields you want to select from the Project model
        })
        .populate({
          path: 'projectsWorkedOn',
          model: 'Project', // Replace with the actual model name for Project
          select: 'name', // Specify the fields you want to select from the Project model
        });

      return { message: 'List of all Earnings', data: earnings };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findById(id: string): Promise<{ message: string; data: Earnings }> {
    try {
      const earning = await this.earningsModel
        .findById(id)
        .populate('member', 'name email')
        .populate('department', 'name')
        .populate({
          path: 'projectsAssigned',
          model: 'Project', // Replace with the actual model name for Project
          select: 'name', // Specify the fields you want to select from the Project model
        })
        .populate({
          path: 'projectsWorkedOn',
          model: 'Project', // Replace with the actual model name for Project
          select: 'name', // Specify the fields you want to select from the Project model
        })
        .exec();
      if (!earning) {
        throw new NotFoundException(`earning not found with ID ${id}`);
      }
      return { message: `Earning with ID ${id} is`, data: earning };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async update(
    id: string,
    updateEarningDto: UpdateEarningDto,
  ): Promise<{ message: string; data: Earnings | null }> {
    try {
      // Validate that the Earnings document exists
      const existingEarnings = await this.earningsModel.findById(id).exec();
      if (!existingEarnings) {
        throw new NotFoundException(`Earnings with ID ${id} not found`);
      }

      // Get currentSalary from the Member model
      const { currentSalary } = await this.memberModel
        .findOne({ _id: existingEarnings.member, isDeleted: false }) // Assuming member is stored in the Earnings document
        .select('currentSalary')
        .exec();
      if (!currentSalary) {
        throw new NotFoundException(
          `Member with ID ${existingEarnings.member} not found or is deleted`,
        );
      }
      console.log('currentSalary:    ', currentSalary);

      // get contractedHours from env file
      const contractedHours = parseInt(
        this.configService.get('CONTRACTED_HOURS'),
        10,
      );
      console.log(
        'contractedHours:   ',
        typeof contractedHours,
        '    ',
        contractedHours,
      );

      let totalWorkedHours: number;
      // Case 1: If totalUnderTimeHours is greater than 0
      if (updateEarningDto.totalUnderTimeHours > 0) {
        totalWorkedHours = Math.round(
          contractedHours - updateEarningDto.totalUnderTimeHours,
        );
      }
      // Case 2: If totalOvertimeHours is greater than 0
      else if (updateEarningDto.totalOvertimeHours > 0) {
        totalWorkedHours = Math.round(
          contractedHours + updateEarningDto.totalOvertimeHours,
        );
      }
      // Case 3: If both totalUnderTimeHours and totalOvertimeHours are zero
      else {
        totalWorkedHours = contractedHours;
      }
      console.log('totalWorkedHours:   ', totalWorkedHours);

      const perHourRate = Math.round(currentSalary / contractedHours);
      console.log('perHourRate:   ', typeof perHourRate);

      const totalEarnings = Math.round(perHourRate * totalWorkedHours);
      console.log(
        'totalEarnings:   ',
        typeof totalEarnings,
        '   ',
        totalEarnings,
      );

      const netSalary = Math.round(
        totalEarnings - updateEarningDto.totalDeductions,
      );
      console.log('netSalary:   ', typeof netSalary);

      // Validation: Invalid values for calculated fields
      if (totalWorkedHours < 0 || totalEarnings < 0 || netSalary < 0) {
        throw new BadRequestException('Invalid values for calculated fields');
      }

      const { member: newMemberId, department } = updateEarningDto;

      const currentMonth = moment().format('MMMM');
      const month = currentMonth;
      const currentYear = parseInt(moment().format('YYYY'), 10); // Convert year to a number
      const year = currentYear;

      // Check if the memberId is being updated
      if (newMemberId && existingEarnings.member.toString() !== newMemberId) {
        throw new BadRequestException(
          'MemberId cannot be changed. It should remain the same.',
        );
      }

      // Check if the month or year is being updat (if provided)
      if (month && existingEarnings.month !== month) {
        throw new BadRequestException(
          'Month cannot be changed. It should remain the same.',
        );
      }

      if (year && existingEarnings.year !== year) {
        throw new BadRequestException(
          'Year cannot be changed. It should remain the same.',
        );
      }

      // Validate that the referenced Department exists
      const departmentExists = await this.departmentModel
        .findById(department)
        .exec();
      if (!departmentExists) {
        throw new NotFoundException(
          `Department with ID ${department} not found`,
        );
      }

      // Update the Earnings instance with the validated data
      const updatedEarning = Object.assign(existingEarnings, {
        ...updateEarningDto,
        totalWorkedHours,
        totalEarnings,
        netSalary,
      });

      // Save the updated Earnings document
      const saveData = await updatedEarning.save();

      if (!saveData) {
        throw new InternalServerErrorException('Error updating Earning');
      }

      // Check if netSalary is updated
      if (netSalary !== undefined) {
        // Update netSalary in payRollModel
        const payRollUpdate = await this.payRollmodel.findOneAndUpdate(
          {
            member: saveData.member,
            month: saveData.month,
            year: saveData.year,
          },
          { netSalary: netSalary },
          { new: true },
        );

        if (!payRollUpdate) {
          throw new NotFoundException(
            `PayRoll not found for member ID ${saveData.member} in month ${saveData.month} and year ${saveData.year}`,
          );
        }
      }

      return {
        message: `Earning with ID ${id} updated successfully`,
        data: saveData,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      const deletedEarning = await this.earningsModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedEarning) {
        throw new NotFoundException(`Earning with ID ${id} not found`);
      }
      return { message: `Earning with ID ${id} deleted` };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
