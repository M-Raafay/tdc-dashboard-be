import { Module } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModule } from 'src/department/department.module';
import { DepartmentSchema } from 'src/department/schema/department.schema';
import { MembersModule } from 'src/members/members.module';
import { MemberSchema } from 'src/members/schema/members.schema';
import { PayrollSchema } from 'src/pay-roll/schema/Payroll.schema';

@Module({
  imports: [
    MembersModule,
    DepartmentModule,
    MongooseModule.forFeature([
      { name: 'PayRoll', schema: PayrollSchema },
      { name: 'Department', schema: DepartmentSchema },
      { name: 'Member', schema: MemberSchema },
      { name: 'Earnings', schema: MemberSchema },
    ]),
  ],
  controllers: [EarningsController],
  providers: [EarningsService],
})
export class EarningsModule {}
