import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './schema/members.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { response } from 'express';

@Injectable()
export class MembersService {

  constructor(@InjectModel('Member') private memberModel: Model<Member>) {}
  
  async create(createMemberDto: CreateMemberDto) {
    
    const userData = await this.memberModel.create(createMemberDto);
    return userData;
  }

  findAll() {
    return this.memberModel.find();
  }

  async findOne(id: string) {
    const data = await this.memberModel.findById({_id : id});
   //  const data = await this.memberModel.findOne({member_id : id})
    if(!data){
      throw new HttpException('not found' , 404)
    }
    return data;
  }

  async update(id: string, updateMemberDto: UpdateMemberDto):Promise<Member> { 
    const data =await this.memberModel.findByIdAndUpdate(id, {...updateMemberDto} ,{new:true})
    return data;
  }

  async remove(id: string) {
    const data = await this.memberModel.findByIdAndDelete({_id :id})
    return 'Member Deleted ';
  }
}
