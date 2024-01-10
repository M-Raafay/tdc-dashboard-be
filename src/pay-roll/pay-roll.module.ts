import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MembersModule } from 'src/members/members.module';
import { MemberSchema } from 'src/members/schema/members.schema';
import { DepartmentSchema } from 'src/department/schema/department.schema';
import { DepartmentModule } from 'src/department/department.module';
import { PayRollService } from './pay-roll.service';
import { PayRollController } from './pay-roll.controller';
import { PayrollSchema } from './schema/Payroll.schema';

@Module({
  imports: [
    MembersModule,
    DepartmentModule,
    MongooseModule.forFeature([
      { name: 'PayRoll', schema: PayrollSchema },
      { name: 'Department', schema: DepartmentSchema },
      { name: 'Member', schema: MemberSchema },
    ]),
  ],

  controllers: [PayRollController],
  providers: [PayRollService],
  exports: [PayRollService],
})
export class PayRollModule {}
