import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { PayRoll } from './schema/Payroll.schema';
import { CreatePayRollDto } from './dto/create-pay-roll.dto';
import { UpdatePayRollDto } from './dto/update-pay-roll.dto';
import { Member } from 'src/members/schema/members.schema';
import { Department } from 'src/department/schema/department.schema';
import moment from 'moment';
import { memberSelectFields } from 'src/utils/removed_field';
import { populate } from 'dotenv';
import { Earnings } from 'src/earnings/schema/earnings.schema';

@Injectable()
export class PayRollService {
  constructor(
    @InjectModel(PayRoll.name) private readonly payRollModel: Model<PayRoll>,
    @InjectModel(Earnings.name) private readonly earningsModel: Model<Earnings>,
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(Department.name)
    private readonly departmentModel: Model<Department>,
  ) {}
  //ToDOtask: also check that if member with smae id alread exist in payroll modle than dont allow to create pay roll aginst that member status:Done

  async create(createPayRollDto: CreatePayRollDto) {
    try {
      // const { member, department } = createPayRollDto;
      const { member } = createPayRollDto;

      // Validate that the referenced Member exists
      const memberExist = await this.memberModel
        .findById({ _id: member })
        .exec();

      if (!memberExist) {
        throw new NotFoundException(`Member with ID ${member} not found`);
      }

      // Check if the member is deleted
      if (memberExist.isDeleted) {
        throw new NotFoundException(`Member with ID ${member} is deleted`);
      }

      // Automatically fetch the department associated with the member
      const department = memberExist.department;

      // Validate that the associated Department exists
      if (!department) {
        throw new NotFoundException(
          `Department not found for the provided member`,
        );
      }

      // Check if a payroll with the same member ID and month already exists
      const currentMonth = moment().format('MMMM');
      const currentYear = parseInt(moment().format('YYYY'), 10); // Convert year to a number

      const existingPayRoll = await this.payRollModel
        .findOne({ member, month: currentMonth })
        .exec();

      if (existingPayRoll) {
        throw new ConflictException(
          `PayRoll for Member with ID ${member} in the current month already exists`,
        );
      }

      // Get netSalary from the earning model
      const netSalaryExist = await this.earningsModel
        .findOne({ member: member, month: currentMonth })
        .select('netSalary')
        .exec();

      // Check if netSalary exists
      if (!netSalaryExist) {
        throw new NotFoundException(
          `Net Salary for the member ID ${member} in month ${currentMonth} has not been generated yet.`,
        );
      }

      const memberSalary = netSalaryExist.netSalary;

      // Create a new PayRoll instance with the validated data
      const payRoll = await this.payRollModel.create({
        ...createPayRollDto,
        department,
        netSalary: memberSalary, // Set the netSalary based on the member's current salary
        month: currentMonth,
        year: currentYear,
      });

      return {
        message: `New payRoll created successfully for member ID ${member} in month ${currentMonth}`,
        data: payRoll,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // with populated data of reference documents
  async findAllPopulated() {
    try {
      const payRolls = await this.payRollModel
        .find()
        .populate('member', 'name email')
        .populate({ path: 'department', select: 'name' });

      return { message: `payRolls of all Departments`, data: payRolls };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async findOnePopulated(id: string) {
    try {
      // Validate that the provided ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new NotFoundException(`Invalid ID: ${id}`);
      }
      const payRoll = await this.payRollModel
        .findById(id)
        .populate('member', 'name email')
        .populate({ path: 'department', select: 'name' })
        .exec();
      if (!payRoll) {
        throw new NotFoundException('PayRoll not found');
      }
      return payRoll;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // New method to search payrolls by department name
  async searchByDepartmentName(departmentName: string) {
    try {
      // Find the department with the given name
      const department = await this.departmentModel
        .findOne({ name: departmentName })
        .exec();

      if (!department) {
        throw new NotFoundException(
          `Department with name '${departmentName}' not found`,
        );
      }

      // Retrieve all payrolls for the found department
      const payRolls = await this.payRollModel
        .find({ department: department._id })
        .populate('member', 'name email')
        .populate({ path: 'department', select: 'name' })
        .exec();

      return { message: `payRolls for '${departmentName}'`, data: payRolls };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUniqueDepartmentNames(): Promise<{
    message: string;
    data: string[];
  }> {
    try {
      const departmentNames = await this.payRollModel
        .aggregate([
          {
            $match: {
              department: { $ne: null, $exists: true },
            },
          },
          {
            $lookup: {
              from: 'departments', // Replace with the actual name of your Department collection
              localField: 'department',
              foreignField: '_id',
              as: 'departmentInfo',
            },
          },
          {
            $unwind: '$departmentInfo', // Unwind the array created by $lookup
          },
          {
            $group: {
              _id: '$department',
              name: { $first: '$departmentInfo.name' },
            },
          },
        ])
        .exec();
      const departmentsList = departmentNames.map((dept) => dept.name);
      return { message: `Departments List`, data: departmentsList };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //todo: make check to rstrict the member id change only
  async update(id: string, updatePayRollDto: UpdatePayRollDto) {
    try {
      const previousData = await this.payRollModel.findById({ _id: id });
      if (!previousData) {
        throw new BadRequestException(
          `Error in request. PayRoll with ID ${id} not found`,
        );
      }

      // Update the PayRoll instance with the validated data
      const updatedPayRoll = Object.assign(previousData, updatePayRollDto);
      const saveData = await updatedPayRoll.save();

      if (!saveData) {
        throw new InternalServerErrorException('Error updating payroll');
      }

      return {
        message: `PayRoll with ID ${id} updated successfully`,
        data: saveData,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //TodoTask: in memmber when you remove member than you also handle there to remove the payroll link with that member ---> status:discussion pending on it
  async remove(id: string) {
    try {
      const deletedPayRoll = await this.payRollModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedPayRoll) {
        throw new NotFoundException(`PayRoll with ID ${id} not found`);
      }
      return { message: `payRoll with ID ${id} deleted` };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //Extra Tasks: createAllPayrollsForCurrentMonth by one click for one member-----> Staus:Pending,bugs resolving
  async createPayrollsBasedOnSelectedDate() {
    try {
      // Get the selected date
      const selectedDate = moment().date(); // You can replace this with the actual selected date

      // Get the current month and year
      const currentMonth = moment().format('MMMM');
      const currentYear = moment().format('YYYY');

      // Calculate the previous month
      const previousMonth = moment().subtract(1, 'months').format('MMMM');
      const previousYear = moment().subtract(1, 'months').format('YYYY');

      let targetMonth: string;
      let targetYear: string;

      // Check if the selected date is between 28 and 31
      if (selectedDate >= 28 && selectedDate <= 31) {
        targetMonth = currentMonth;
        targetYear = currentYear;
      } else if (selectedDate >= 1 && selectedDate <= 5) {
        // Check if the selected date is between 1 and 5
        targetMonth = previousMonth;
        targetYear = previousYear;
      } else {
        throw new BadRequestException(
          'Invalid date selection. Payrolls can only be created between the 28th and 31st for the current month or between the 1st and 5th for the previous month.',
        );
      }

      // Get all existing payrolls for the target month
      const existingPayrollsForTargetMonth = await this.payRollModel
        .find({ month: targetMonth, year: targetYear })
        .exec();

      // Loop through existing payrolls for the target month and create payrolls for the current month
      const payrollsForTargetMonth = await Promise.all(
        existingPayrollsForTargetMonth.map(async (existingPayroll: any) => {
          // Check if a payroll for the member and target month already exists
          const existingTargetMonthPayroll = await this.payRollModel
            .findOne({
              member: existingPayroll.member,
              month: targetMonth,
              year: targetYear, // Assuming you also store the year in the PayRoll model
            })
            .exec();

          if (existingTargetMonthPayroll) {
            console.log(
              `PayRoll for Member with ID ${existingPayroll.member} in ${targetMonth} already exists`,
            );
            return existingTargetMonthPayroll;
          }

          // Create a new PayRoll instance for the member and target month
          return await this.payRollModel.create({
            member: existingPayroll.member,
            department: existingPayroll.department,
            accountTitle: existingPayroll.accountTitle,
            cnic: existingPayroll.cnic,
            accountNo: existingPayroll.accountNo,
            netSalary: existingPayroll.netSalary
              ? existingPayroll.netSalary
              : 0,
            month: targetMonth,
            year: targetYear, // Assuming you also store the year in the PayRoll model
          });
        }),
      );

      return {
        message: `New payrolls created successfully for ${payrollsForTargetMonth.length} members in ${targetMonth}`,
        data: payrollsForTargetMonth,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
