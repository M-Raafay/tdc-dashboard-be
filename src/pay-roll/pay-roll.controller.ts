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
  UseGuards,
} from '@nestjs/common';
import { PayRollService } from './pay-roll.service';
import { CreatePayRollDto } from './dto/create-pay-roll.dto';
import { UpdatePayRollDto } from './dto/update-pay-roll.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/members/schema/members.schema';
import { Roles } from 'src/roles/role.decorator';

//pending tasks: add authguard and role guard ---->status:done
@UseGuards(JwtAuthGuard)
@Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
@Controller('payroll')
export class PayRollController {
  constructor(private readonly payRollService: PayRollService) {}

  @Post('/create')
  create(@Body() createPayRollDto: CreatePayRollDto) {
    return this.payRollService.create(createPayRollDto);
  }

  // New endpoint to fetch all PayRoll data with populated references
  @Get('/getAll')
  findAllPopulated() {
    return this.payRollService.findAllPopulated();
  }

  // New endpoint to fetch a specific PayRoll with populated references
  @Get('/getById/:id')
  findOnePopulated(@Param('id') id: string) {
    return this.payRollService.findOnePopulated(id);
  }

  // New endpoint to search payrolls by department name
  @Get('/getByDepartmentName')
  searchByDepartmentName(@Query('departmentName') departmentName: string) {
    return this.payRollService.searchByDepartmentName(departmentName);
  }

  // New endpoint to get unique department names
  @Get('/departmentsList')
  async getUniqueDepartmentNames() {
    return this.payRollService.getUniqueDepartmentNames();
  }

  @Put('/updateById/:id')
  update(@Param('id') id: string, @Body() updatePayRollDto: UpdatePayRollDto) {
    return this.payRollService.update(id, updatePayRollDto);
  }

  // @Patch('/partiallyUpdateById/:id')
  // partiallyUpdate(
  //   @Param('id') id: string,
  //   @Body() updatePayRollDto: UpdatePayRollDto,
  // ) {
  //   return this.payRollService.partiallyUpdate(id, updatePayRollDto);
  // }

  @Delete('/deleteById/:id') // ----> pending task:perform soft delete
  remove(@Param('id') id: string) {
    return this.payRollService.remove(id);
  }

  @Get('/createPayrollsBasedOnSelectedDate')
  createPayrollsBasedOnSelectedDate() {
    return this.payRollService.createPayrollsBasedOnSelectedDate();
  }
}
