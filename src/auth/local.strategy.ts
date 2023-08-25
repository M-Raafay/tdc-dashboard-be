import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { MembersService } from "src/members/members.service";
import { log } from "console";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
      super();
    }
  
    // async validate(name: string, password: string): Promise<any> {
    //   console.log('1');
      
    //   const user = await this.authService.validateAdmin(name, password);
    //   if (!user) {
    //     throw new UnauthorizedException();
    //   }
    //   return user;
    // }
    async validate(username: string, password: string): Promise<any> {
      console.log('ins');
      
      const userMember = await this.authService.validateMember(username, password);
      console.log(username,password);
        
      if (userMember) {
        console.log('userMember');
        return userMember;
      }
      const userAdmin = await this.authService.validateAdmin(username, password);
      if (userAdmin) {
        return userAdmin;
      }
      if(!userMember || !userAdmin){
        throw new UnauthorizedException();    
      }

      //throw new UnauthorizedException();      
    }
  }