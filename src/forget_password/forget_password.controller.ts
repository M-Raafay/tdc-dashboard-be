import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ForgetPasswordService } from './forget_password.service';
import { ResetPasswordDto } from './dto/reset_password.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/auth/getuser.decorator';
import { User } from 'src/utils/interface';

@Controller('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

  @Post()
  forgetPasswordMail(@Body('email') email: string) {
    return this.forgetPasswordService.checkMail(email);
  }

  @Post('verify')
  tokenVerify(@Query('token') token: string) {
    return this.forgetPasswordService.verifyToken(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset')
  resetForgotPassword(
    @Body() resetPasswordDTo: ResetPasswordDto,
    @GetUser() user:User
  ) {
    console.log('insode');
    
    return this.forgetPasswordService.resetForgotPassword(
      resetPasswordDTo,user
    );
  }
}
