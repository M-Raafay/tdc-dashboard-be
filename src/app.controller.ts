import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { GetUser } from './auth/getuser.decorator';
import { User } from './utils/interface';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
    return {message:'TDC-DASHBOARD is Live'};
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  checkJwt(@GetUser() user: User) {
    return user;
  }
}
