import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // adminLogin(@Body() createAuthDto: CreateAuthDto ) {
  //   this.authService.validateUser()
  // }

}
