import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/role.decorator';
import { Member, Role } from 'src/members/schema/members.schema';
import { GetUser } from 'src/auth/getuser.decorator';
import { User } from 'src/utils/interface';

@UseGuards(JwtAuthGuard)
//@Roles(Role.BUSINESS_MANAGER, Role.SUPERADMIN, Role.ADMIN)
@Controller('project')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post('create')
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() member: User) {
    return this.projectsService.create(createProjectDto, member);
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
