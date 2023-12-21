import { Module } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { TeamsController } from './teams.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsSchema } from './schema/teams.schema';
import { MemberSchema } from 'src/members/schema/members.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Teams', schema: TeamsSchema }]),
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
