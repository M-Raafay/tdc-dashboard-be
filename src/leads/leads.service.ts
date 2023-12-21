import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lead } from './schema/leads.schema';
import { Model } from 'mongoose';
import { User } from 'src/utils/interface';

@Injectable()
export class LeadsService {
  constructor(@InjectModel('Lead') private leadModel: Model<Lead>) {}

  async create(createLeadDto: CreateLeadDto, member:User) {
     try {
       const leadCreated = await this.leadModel.create({
         ...createLeadDto,
         salesTeamMember: member._id,
       });

       return leadCreated;
     } catch (error) {
       throw new InternalServerErrorException(error.message);
     }
  }

  async findAll() {
    return await this.leadModel
      .find()
      .populate('salesTeamMember')
      .populate('client');
  }

  async findOne(id: number) {
   return await this.leadModel
     .findById({ _id: id })
     .populate('salesTeamMember')
     .populate('client');;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const updatedData = await this.leadModel.findByIdAndUpdate(
      id,
      { $set: updateLeadDto },
      { new: true },
    );
    return updatedData;
  }

  async remove(id: string) {
     const lead = await this.leadModel.findByIdAndDelete({ _id: id });
     if (!lead) {
       throw new NotFoundException(
         'Lead not found OR doesnot exists : Wrong ID',
       );
     }
     return { message: 'Lead Deleted ' };
  }
}
