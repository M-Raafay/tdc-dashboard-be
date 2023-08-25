import { Controller, Get, Post, Body, Patch, Param, Delete,Request, UseGuards, Header, Req } from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { Role } from 'src/roles/role.enum';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { SignUpDto } from './dto/signup-member.dto';
//import { AuthService } from 'src/auth/auth.service';

//@UseGuards(JwtAuthGuard)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService ,
    ) {}

  @Post('/signup')
  createForMember(@Body() signupDto: SignUpDto){
    return this.membersService.signup(signupDto)

  }

  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // memberLogin(@Request() req):any { // return jwt access
  //   console.log(req.user);
    
  //   return this.authService.loggedIn(req.user['_doc'])
  // //   return {
  // //     admin : req.user['_doc'],
  // //     message : 'Logged in'
  // // };
  // }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post()
  create(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.createMember(createMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin,Role.Super_Admin,Role.User)
  @Get()
  findAll(@Req() req):any {
    return this.membersService.findAll(req);
  }

  @Roles(Role.Admin)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findOneById(id);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
