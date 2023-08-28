import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { JwtService} from '@nestjs/jwt';
import { MembersService } from 'src/members/members.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private adminService : AdminService , private jwtService: JwtService, 
    private memberService: MembersService,
    private readonly configService: ConfigService){}

  async validateAdmin(email: string, userPassword:string){
    console.log('validate admin');
    const adminMail = email.toLowerCase();
    const adminData = await this.adminService.findAdminByMail(adminMail)
    if (!adminData) {
      throw new NotAcceptableException('could not find the user');
    }
    const passwordValid = await bcrypt.compare(userPassword, adminData.password)
    if(!passwordValid){
      throw new NotAcceptableException('wrong crendentials');
    }
    if (adminData && passwordValid) {
      const {password, ...data} = adminData   
      return data;
    }    
    
      return null;
  }
  async validateMember(email: string, password:string){
    const memberEmail = email.toLowerCase();
    const memberData = await this.memberService.findMember(memberEmail)    
    if (!memberData) {
      return ;
    }
    const passwordValid = await bcrypt.compare(password, memberData.password)  
    if(!passwordValid){
      throw new NotAcceptableException('wrong crendentials');
    }
    if (memberData && passwordValid) {
      const {password, ...data} = memberData   
//      console.log(data);
      
      return data;
    }    
      return null;
  }

  async loggedIn(user:any){ 


    // Access the secret key from the configuration
    const secret = this.configService.get('SECRET');
    // console.log(secret);
    // console.log('edewfew',user);
    
    const payload = {name : user.username||user.admin_name , id : user._id, role : user.role}
    const token =  this.jwtService.sign(payload)
    return {access_token : token, ...payload};
  }

}
