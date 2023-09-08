import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './role.decorator';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector , private jwtService: JwtService,) {}

  canActivate(context: ExecutionContext): boolean |Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
       context.getHandler(),
       context.getClass(), 
    ]);

    if (!requiredRoles) {
      return true;
    }
   const request  = context.switchToHttp().getRequest();
   const authHeader = request.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer')) {
    return false; 
  }

  try{
  const token = authHeader.substring(7); 
  const decoded = this.jwtService.verify(token);   

  const userRoles: string[] = decoded.role || [];

  return requiredRoles.some((role) => userRoles.includes(role));
}
  catch(err)
  {
    return err.message
  }
    // const user = {
    //     _id: "64d4cae1add19d6b97a3adb0",
    //     name: "ali",
    //     role: "super_admin"
    // }
  //  console.log(user);
    
  //  return requiredRoles.some((role) => user.role?.includes(role));
  }
}