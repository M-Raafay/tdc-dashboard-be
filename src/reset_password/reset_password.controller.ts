import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards, Query } from '@nestjs/common';
import { ResetPasswordService } from './reset_password.service';
import { ResetPasswordDto } from './dto/reset_password.dto';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  resetPassword(@Body() resetPasswordDto:ResetPasswordDto, @Request() req:any){
    return this.resetPasswordService.resetPassword(resetPasswordDto,req.user)
  }


  // @Post()
  // resetPassword(@Body('email') email: string) {
  //   return this.resetPasswordService.resetPassword(email);
  // }

  // @Get()
  // findAll() {
  //   return this.resetPasswordService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.resetPasswordService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateResetPasswordDto: UpdateResetPasswordDto) {
  //   return this.resetPasswordService.update(+id, updateResetPasswordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.resetPasswordService.remove(+id);
  // }
}
