import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client } from './schema/client.schema';
import { Model } from 'mongoose';
import { User } from 'src/utils/interface';
import { memberSelectFields } from 'src/utils/removed_field';
import { Member } from 'src/members/schema/members.schema';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel('Client') private clientModel: Model<Client>,
    @InjectModel('Member') private memberModel: Model<Member>,
  ) {}

  async create(createClientDto: CreateClientDto, member: User) {
    try {
      const createdByData = await this.memberModel
        .findById(member._id)
        .select(memberSelectFields);
      const clientCreate = await this.clientModel.create({
        ...createClientDto,
        createdBy: createdByData,
      });

      return clientCreate;
    } catch (error) {
      throw new InternalServerErrorException(`${error.message}`);
    }
  }

  async findAll() {
    return await this.clientModel.find();
  }

  async findOne(id: string) {
    return await this.clientModel.findById({ _id: id });
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const updatedData = await this.clientModel.findByIdAndUpdate(
      id,
      { $set: updateClientDto },
      { new: true },
    );
    return updatedData;
  }

  async remove(id: string) {
    const client = await this.clientModel.findByIdAndDelete({ _id: id });
    if (!client) {
      throw new NotFoundException(
        'Client not found OR doesnot exists : Wrong ID',
      );
    }
    return { message: 'Member Deleted ' };
  }
}
