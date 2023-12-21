import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './role.decorator';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/members/schema/members.schema';

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
    
  }
}
