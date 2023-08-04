import { Module } from '@nestjs/common';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from './schema/members.schema';

@Module({
  imports : [MongooseModule.forFeature([{name: 'Member', schema: MemberSchema}])],
  controllers: [MembersController],
  providers: [MembersService]
})
export class MembersModule {}
