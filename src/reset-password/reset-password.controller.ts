import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';
import { CreateResetPasswordDto } from './dto/create-reset-password.dto';
import { UpdateResetPasswordDto } from './dto/update-reset-password.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post()
  resetPassword(@Body('email') email: string) {
    return this.resetPasswordService.resetPassword(email);
  }

  @Get()
  findAll() {
    return this.resetPasswordService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.resetPasswordService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResetPasswordDto: UpdateResetPasswordDto) {
    return this.resetPasswordService.update(+id, updateResetPasswordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.resetPasswordService.remove(+id);
  }
}
