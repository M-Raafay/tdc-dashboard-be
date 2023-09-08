import { Injectable, NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { AdminService } from 'src/admin/admin.service';
import { MembersService } from 'src/members/members.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ForgetPasswordService {

  constructor  (
    private adminService : AdminService ,
    private memberService: MembersService,
    private jwtService: JwtService,
    private readonly emailService: MailerService,
    private readonly configService: ConfigService
    ){}

  async checkMail(email:string) {

    const adminData = await this.adminService.findAdminByMail(email)
    const memberData = await this.memberService.findMember(email)
    
    if(!memberData && !adminData){
      throw new NotFoundException('wrong email: user doesnot exists')
    }else if(adminData){

      const res = this.createTokenAndMail(adminData)
      return res

    }else if(memberData){
      const res = this.createTokenAndMail(memberData)
      return res

    }


    return null;
  }
 
  async createTokenAndMail(data){
    const {_id , email,role} = data
    const payload = {_id, email,role}
    
    const jwtToken = this.jwtService.sign(payload)

    const link = `http://localhost:3000/newpassword/id/${_id}/token/${jwtToken}`

    const emailBody = `<p>Click this URL to reset password:</p>
                       <a href="${link}">${link}</a>`;
     await this.emailService.sendEmail(email, emailBody)

    return {message:'Check your email'}
  }



  resetForgotPassword(id : string,token:string,resetPasswordDTo:ResetPasswordDto){

    console.log(id, 'scscs' , token, 'token', resetPasswordDTo);
    
    
  }

  // findAll() {
  //   return `This action returns all forgetPassword`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} forgetPassword`;
  // }

  // update(id: number, updateForgetPasswordDto: UpdateForgetPasswordDto) {
  //   return `This action updates a #${id} forgetPassword`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} forgetPassword`;
  // }
}
