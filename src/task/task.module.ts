import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskSchema } from './schema/task.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from 'src/members/schema/members.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }])
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
