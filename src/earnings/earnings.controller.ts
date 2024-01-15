// src/earnings/earnings.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { CreateEarningDto } from './dto/create-earning.dto';
import { UpdateEarningDto } from './dto/update-earning.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/members/schema/members.schema';
import { Roles } from 'src/roles/role.decorator';

@UseGuards(JwtAuthGuard)
@Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) {}

  @Post('create')
  create(@Body() createEarningDto: CreateEarningDto) {
    return this.earningsService.create(createEarningDto);
  }

  @Get('getAll')
  findAll() {
    return this.earningsService.findAll();
  }

  @Get('getById/:id')
  findById(@Param('id') id: string) {
    return this.earningsService.findById(id);
  }

  @Patch('updateById/:id')
  update(@Param('id') id: string, @Body() updateEarningDto: UpdateEarningDto) {
    return this.earningsService.update(id, updateEarningDto);
  }

  @Delete('deleteById/:id')
  delete(@Param('id') id: string) {
    return this.earningsService.delete(id);
  }
}
