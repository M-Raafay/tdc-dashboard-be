import { Body, Controller, Get, Post,Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/local.auth.guard';
import { AuthGuard } from './auth/authenticated.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  adminLogin(@Request() req):any { // return jwt access
    return this.authService.loggedIn(req.user['_doc'])

  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getHello(@Request() req): string { // require bearer token
    return req.user;
  }
}
