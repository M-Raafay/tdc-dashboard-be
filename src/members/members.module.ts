import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/members.schema';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports : [MongooseModule.forFeature([{name: 'Member', schema: MemberSchema}]), ProjectsModule],
  controllers: [MembersController],
  providers: [MembersService]
})
export class MembersModule {}
