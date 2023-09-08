import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ForgetPasswordService } from './forget_password.service';
import {  ResetPasswordDto } from './dto/reset_password.dto';

@Controller('forget-password')
export class ForgetPasswordController {
  constructor(private readonly forgetPasswordService: ForgetPasswordService) {}

 @Post()
  forgetPasswordMail(@Body('email') email:string) {
    return this.forgetPasswordService.checkMail(email);
  }

  // @Post()
  // create(@Body() createForgetPasswordDto: CreateForgetPasswordDto) {
  //   return this.forgetPasswordService.create(createForgetPasswordDto);
  // }



  @Post(':id/:token')
  resetPassword(@Param('id') id: string,
    @Param('token')token: string, 
    @Body() resetPasswordDTo:ResetPasswordDto){

      return this.forgetPasswordService.resetForgotPassword(id,token,resetPasswordDTo)
    }

  // @Get()
  // findAll() {
  //   return this.forgetPasswordService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.forgetPasswordService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateForgetPasswordDto: UpdateForgetPasswordDto) {
  //   return this.forgetPasswordService.update(+id, updateForgetPasswordDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.forgetPasswordService.remove(+id);
  // }
}
