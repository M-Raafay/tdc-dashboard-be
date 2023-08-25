import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Request, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';

@UseGuards(JwtAuthGuard)
@Controller('admins')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // adminLogin(@Request() req ) {
  //   return req.user['_doc']
  // }


  @Roles(Role.Super_Admin)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.createAdmin(createAdminDto);
  }
  
  @Get('/adminfind')
  findAdminByName(@Body('name') name: string) {
    return this.adminService.findAdmin(name);
  } // remove.....made for testing


  @Roles(Role.Super_Admin)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Roles(Role.Super_Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOneById(id);
  }
  
  @Roles(Role.Super_Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Roles(Role.Super_Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }

}
