import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import { AdminService } from 'src/admin/admin.service';
import { MembersService } from 'src/members/members.service';
import * as crypto from 'crypto'
import { Token } from './schema/resetToken.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ResetPasswordService {
    constructor  (@InjectModel('Token') private tokenModel: Model<Token>,
    private adminService : AdminService ,
    private memberService: MembersService){}


  
  async resetPassword(userEmail:string) {
    const memberData= await this.memberService.findMember(userEmail)
    const adminData= await this.adminService.findAdminByMail(userEmail)
    if(!memberData && !adminData){
      return new NotFoundException('user with email not found')
    }else if(memberData){
      const token= this.generateToken(memberData._id)
      return token;
    }else if(adminData){
      const token= this.generateToken(adminData._id)
      return token;
    }
    return null;
  }


  async generateToken(id){
    let tokenPrevious = await this.tokenModel.findOne({userId:id})
    if(tokenPrevious){
      await this.tokenModel.findByIdAndDelete({_id: tokenPrevious._id})
    }
    let resetToken= crypto.randomBytes(32).toString("hex");
    const newToken =  await this.tokenModel.create({userId:id, token:resetToken})
      return newToken;
  }

  findAll() {
    return `This action returns all resetPassword`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resetPassword`;
  }

  update(id: number, updateResetPasswordDto: UpdateResetPasswordDto) {
    return `This action updates a #${id} resetPassword`;
  }

  remove(id: number) {
    return `This action removes a #${id} resetPassword`;
  }
}
