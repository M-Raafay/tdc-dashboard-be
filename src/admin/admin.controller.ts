import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // adminLogin(@Request() req ) {
  //   return req.user['_doc']
  // }


  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }
  @Get('/adminfind')
  findAdminByName(@Body('name') name: string) {
    return this.adminService.findAdmin(name);
  } // remove.....made for testing


  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOneById(id);
  }
  

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdminName(id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

}
