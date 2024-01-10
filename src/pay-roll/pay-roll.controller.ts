import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
} from '@nestjs/common';
import { PayRollService } from './pay-roll.service';
import { CreatePayRollDto } from './dto/create-pay-roll.dto';
import { UpdatePayRollDto } from './dto/update-pay-roll.dto';

//pending tasks: add authguard and role guard
@Controller('payroll')
export class PayRollController {
  constructor(private readonly payRollService: PayRollService) {}

  @Post('create')
  create(@Body() createPayRollDto: CreatePayRollDto) {
    return this.payRollService.create(createPayRollDto);
  }

  @Get()
  findAll() {
    return this.payRollService.findAll();
  }

  @Get('getById/:id')
  findOne(@Param('id') id: string) {
    return this.payRollService.findOne(id);
  }

  // New endpoint to fetch all PayRoll data with populated references
  @Get('/populated')
  findAllPopulated() {
    return this.payRollService.findAllPopulated();
  }

  // New endpoint to fetch a specific PayRoll with populated references
  @Get('populated/:id')
  findOnePopulated(@Param('id') id: string) {
    return this.payRollService.findOnePopulated(id);
  }

  // New endpoint to search payrolls by department name
  @Get('getByDepartmentName')
  searchByDepartmentName(@Query('departmentName') departmentName: string) {
    return this.payRollService.searchByDepartmentName(departmentName);
  }

  // New endpoint to get unique department names
  @Get('departmentsList')
  async getUniqueDepartmentNames() {
    return this.payRollService.getUniqueDepartmentNames();
  }

  @Put('updateById/:id')
  update(@Param('id') id: string, @Body() updatePayRollDto: UpdatePayRollDto) {
    return this.payRollService.update(id, updatePayRollDto);
  }

  @Patch('partiallyUpdateById/:id')
  partiallyUpdate(
    @Param('id') id: string,
    @Body() updatePayRollDto: UpdatePayRollDto,
  ) {
    return this.payRollService.partiallyUpdate(id, updatePayRollDto);
  }

  @Delete('deleteById/:id')
  remove(@Param('id') id: string) {
    return this.payRollService.remove(id);
  }

  @Get('createPayrollsBasedOnSelectedDate')
  createPayrollsBasedOnSelectedDate() {
    return this.payRollService.createPayrollsBasedOnSelectedDate();
  }
}
