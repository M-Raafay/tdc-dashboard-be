import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { GetUser } from 'src/auth/getuser.decorator';
import { Member, Role } from 'src/members/schema/members.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { User } from 'src/utils/interface';

@UseGuards(JwtAuthGuard)
///@Roles(Role.SUPERADMIN, Role.HR, Role.ADMIN)
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post('create')
  // create(@Body() createTeamDto: CreateTeamDto, @Req() user: any) {  // -----> here we can also directly use this approch  to get the user from req body which we sent in token payload
  create(@Body() createTeamDto: CreateTeamDto, @GetUser() user: User) {
    return this.teamsService.create(createTeamDto, user);
  }

  @Get()
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamsService.remove(id);
  }
}
