import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { ResetPasswordDto } from './dto/reset_password.dto';
//import { AdminService } from 'src/admin/admin.service';
import { MembersService } from 'src/members/members.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailerService } from 'src/mailer/mailer.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ForgetPasswordService {

  constructor  (
   // private adminService : AdminService ,
    private memberService: MembersService,
    private jwtService: JwtService,
    private readonly emailService: MailerService,
    private readonly configService: ConfigService
    ){}

  async checkMail(email:string) {

    //const adminData = await this.adminService.findAdminByMail(email)
    const memberData = await this.memberService.findMemberByEmail(email)
    
    if(!memberData 
      //&& !adminData
      ){
      throw new NotFoundException('wrong email: user doesnot exists')
    }
    // else if(adminData){

    //   const res = this.createTokenAndMail(adminData)
    //   return res

    // }
    else if(memberData){
      const res = this.createTokenAndMail(memberData)
      return res

    }


    return null;
  }
 
  async createTokenAndMail(data){
    const {_id , email,role} = data
    const payload = {_id, email,role}
    
    const jwtToken = this.jwtService.sign(payload)

    const link = `http://localhost:3000/newpassword?id=${_id}&token=${jwtToken}`

    const emailBody = `<p>Click this URL to reset password:</p>
                       <a href="${link}">${link}</a>`;
     await this.emailService.sendEmail(email, emailBody)

    return {message:'Check your email'}
  }



  async resetForgotPassword(id : string,token:string,resetPasswordDTo:ResetPasswordDto){


    // check if id and token are being sent in request

    try{
    const verifiedToken = this.jwtService.verify(token)
   }catch(error){
    throw new NotAcceptableException('Token verification failed', error.message)
    
   }

   const {new_password, confirm_password} = resetPasswordDTo

   if(new_password !== confirm_password){
    throw new NotAcceptableException('passwords donot match')
   }
    const hashedPassword = await bcrypt.hash(new_password,10)
    

    const decodedToken = this.jwtService.decode(token)



   if(decodedToken['_id'] !== id){
    throw new NotAcceptableException('user is not verified')
   } 
    if(decodedToken['role']==='ADMIN'|| decodedToken['role']==='SUPERADMIN'){
      // const adminData = this.adminService.findByIdAndUpdatePassword(decodedToken['_id'], hashedPassword)
      // if(!adminData){
      //   throw new NotAcceptableException('failed to update password')
      // }
       return {message : "Password updated successfully" }
    }
    
    if(decodedToken['role']==='user'){
      const memberData = this.memberService.findByIdAndUpdatePassword(decodedToken['_id'], hashedPassword)
      if(!memberData){
        throw new NotAcceptableException('failed to update password')
      }
       return {message : "Password updated successfully" }
    }

    return null;

    
  }


  verifyToken(id:string, token:string){
    try{
      const verifiedToken = this.jwtService.verify(token)
     }catch(error){
      throw new NotAcceptableException('Token verification failed', error.message)
     }

     const decodedToken = this.jwtService.decode(token)

     if(decodedToken['_id'] !== id){
      return {message : 'User Not Verified'}
     }else {
      return {message : 'User Verified'}
     }

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
