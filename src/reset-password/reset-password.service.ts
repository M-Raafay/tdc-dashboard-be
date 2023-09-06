import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';
import { AdminService } from 'src/admin/admin.service';
import { MembersService } from 'src/members/members.service';
import * as crypto from 'crypto'
import { Token } from './schema/resetToken.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Member } from 'src/members/schema/members.schema';

@Injectable()
export class ResetPasswordService {
    constructor  (@InjectModel('Token') private tokenModel: Model<Token>,
    private adminService : AdminService ,
    private memberService: MembersService){}



    async resetPassword(resetPasswordDto:ResetPasswordDto, user:object){

      if(resetPasswordDto.new_password !== resetPasswordDto.confirm_password){
        throw new NotAcceptableException('new password and confirm password doesnot match')
      }

      if(user['role'] === 'user'){
      const existingUser = await this.memberService.resetMemberPassword(user['_id'], resetPasswordDto)
      return 'password updated successfuly';
      }

      if(user['role'] === 'admin'){
        const existingUser = await this.adminService.resetAdminPassword(user['_id'], resetPasswordDto)
        return 'password updated successfuly'
      }

      return null;

      
      
    }
  
  async resetPasswordToken(userEmail:string) {
    const memberData= await this.memberService.findMember(userEmail)
    const adminData= await this.adminService.findAdminByMail(userEmail)
    try {
      if(!memberData && !adminData){
        return new NotFoundException('user with email not found')
      }else if(memberData){
        const token= this.generateToken(memberData._id)
        return token;
      }else if(adminData){
        const token= this.generateToken(adminData._id)
        return token;
      }
    }catch(err){
      throw new HttpException('failed', HttpStatus.INTERNAL_SERVER_ERROR, err.message)
    }
    return null;
  }


  async generateToken(id:any){
    let tokenPrevious = await this.tokenModel.findOne({userId:id})
    console.log(tokenPrevious);
    
    if(tokenPrevious){
      await this.tokenModel.findByIdAndDelete({_id: tokenPrevious._id})
    }
    let resetToken= crypto.randomBytes(32).toString("hex");
    const newToken =  await this.tokenModel.create({userId:id, token:resetToken})
    console.log('newtoken \n', newToken);
    
      return newToken;
  }

  // findAll() {
  //   return `This action returns all resetPassword`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} resetPassword`;
  // }

  // update(id: number, updateResetPasswordDto: UpdateResetPasswordDto) {
  //   return `This action updates a #${id} resetPassword`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} resetPassword`;
  // }
}
