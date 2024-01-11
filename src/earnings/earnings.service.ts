// src/earnings/earnings.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Earnings } from './schema/earnings.schema';
// import { MembersService } from 'src/members/members.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { Member } from 'src/members/schema/members.schema';

@Injectable()
export class EarningsService {
  constructor(
    @InjectModel('Earnings') private readonly earningsModel: Model<Earnings>,
    @InjectModel('Member') private readonly memberModel: Model<Member>,
    private configService: ConfigService,
  ) {}

  async create(createEarningDto: CreateEarningDto): Promise<Earnings> {
    // Get currentSalary from the Member model
    const { currentSalary } = await this.memberModel
      .findById(createEarningDto.member)
      .select('currentSalary')
      .exec();
    console.log('currentSalary: ', currentSalary);

    const contractedHours = parseInt(
      this.configService.get('CONTRACTED_HOURS'),
      10,
    );
    console.log('contractedHours:   ', contractedHours);

    // Calculate totalEarnings, netSalary, and other fields
    const totalWorkedHours = Math.round(
      createEarningDto.totalOvertimeHours +
        createEarningDto.totalUnderTimeHours,
    );

    const perHourRate = Math.round(currentSalary / contractedHours);
    const totalEarnings = Math.round(perHourRate * totalWorkedHours);
    const netSalary = Math.round(
      totalEarnings - createEarningDto.totalDeductions,
    );

    const createdEarnings = await this.earningsModel.create({
      contractedHours,
      currentSalary,
      totalWorkedHours,
      totalEarnings,
      netSalary,
      ...createEarningDto
    });
    console.log('createdEarnings:  ', createdEarnings);

    // Save the calculated values to the database
    return createdEarnings.save();
  }

  // async create(createEarningDto: CreateEarningDto): Promise<Earnings> {
  //   // Calculate totalEarnings, netSalary, and other fields
  //   const totalWorkedHours = createEarningDto.totalOvertimeHours + createEarningDto.totalUnderTimeHours;

  //   const perHourRate = createEarningDto.currentSalary / createEarningDto.contractedHours;
  //   const totalEarnings = perHourRate * totalWorkedHours;
  //   const netSalary = totalEarnings - createEarningDto.totalDeductions;

  //   const createdEarnings = new this.earningsModel({
  //     ...createEarningDto,
  //     totalWorkedHours,
  //     totalEarnings,
  //     netSalary,
  //   });

  //   // Save the calculated values to the database
  //   return createdEarnings.save();
  // }

  async findAll(): Promise<Earnings[]> {
    return this.earningsModel.find().exec();
  }

  async findById(id: string): Promise<Earnings | null> {
    return this.earningsModel.findById(id).exec();
  }

  async update(
    id: string,
    updateEarningDto: UpdateEarningDto,
  ): Promise<Earnings | null> {
    // Validate that the Earnings document exists
    const existingEarnings = await this.earningsModel.findById(id).exec();
    if (!existingEarnings) {
      throw new NotFoundException(`Earnings with ID ${id} not found`);
    }

    // Get currentSalary from the Member model
    const { currentSalary } = await this.memberModel
      .findById(existingEarnings.member) // Assuming member is stored in the Earnings document
      .select('currentSalary')
      .exec();

    const contractedHours = parseInt(
      this.configService.get('CONTRACTED_HOURS'),
      10,
    );
    // Calculate totalEarnings, netSalary, and other fields
    const totalWorkedHours =
      updateEarningDto.totalOvertimeHours +
      updateEarningDto.totalUnderTimeHours;

    const perHourRate = currentSalary / contractedHours;
    const totalEarnings = perHourRate * totalWorkedHours;
    const netSalary = totalEarnings - updateEarningDto.totalDeductions;

    // Update the existing Earnings document with the new values
    return this.earningsModel
      .findByIdAndUpdate(
        id,
        {
          ...updateEarningDto,
          totalWorkedHours,
          totalEarnings,
          netSalary,
        },
        { new: true },
      )
      .exec();
  }

  async delete(id: string): Promise<Earnings | null> {
    return this.earningsModel.findByIdAndDelete(id).exec();
  }
}
