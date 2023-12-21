import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentSchema } from './schema/department.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberSchema } from 'src/members/schema/members.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
