import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AdminService } from 'src/admin/admin.service';
import { JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private adminService : AdminService , private jwtService: JwtService){}

  async validateAdmin(userName: string, userPassword:string){
    const adminName = userName.toLowerCase();
    const adminData = await this.adminService.findAdmin(adminName)
    const passwordValid = await bcrypt.compare(userPassword, adminData.password)
    if (adminData && passwordValid) {
      const {password, ...data} = adminData      
      return data;
    }    
    if (!adminData) {
      throw new NotAcceptableException('could not find the user');
    }
      return null;
  }

  async loggedIn(user:any){ 
    const payload = {name : user.name , sub : user._id}
    const token =  this.jwtService.sign(payload)
    return {access_token : token};
  }

  //async findByPayload()

}
