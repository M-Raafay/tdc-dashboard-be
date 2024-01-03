import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Header,
  Req,
  NotAcceptableException,
  ForbiddenException,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { LogInMemberDto } from './dto/login-member.dto';
import { GetUser } from 'src/auth/getuser.decorator';
import { Member, Role } from './schema/members.schema';
import { ResetPasswordDto } from './dto/reset-password.dto';

// @UseGuards(JwtAuthGuard)
// @Roles(Role.SUPERADMIN, Role.HR)
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
  @Post('create')
  create(@Body() createMemberDto: CreateMemberDto, @GetUser() user: Member) {
    const forbiddenRoles = ['SUPERADMIN', 'ADMIN'];

    if (user.role === 'HR' && forbiddenRoles.includes(createMemberDto.role)) {
      throw new ForbiddenException('User doesnot have access');
    }
    return this.membersService.createMember(createMemberDto, user);
  }

  @Post('login')
  login(@Body() logInMemberDto: LogInMemberDto) {
    return this.membersService.login(logInMemberDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset_password')
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @GetUser() user: Member,
  ) {
    return this.membersService.resetPassword(resetPasswordDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
  //@REMOVE made for testing
  @Get('byEmail')
  findOnebymail(@Body('email') email: string) {
    return this.membersService.findMemberByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
  @Get()
  findAll(): any {
    return this.membersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.membersService.findMemberById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMemberDto: UpdateMemberDto) {
    return this.membersService.update(id, updateMemberDto);
  }
  @UseGuards(JwtAuthGuard)
  @Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membersService.remove(id);
  }
}
