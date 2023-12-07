import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DepartmentSchema } from './schema/department.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Department', schema: DepartmentSchema },
    ]),
  ],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
