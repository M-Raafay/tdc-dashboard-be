import { Module } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DepartmentModule } from 'src/department/department.module';
import { DepartmentSchema } from 'src/department/schema/department.schema';
import { MembersModule } from 'src/members/members.module';
import { MemberSchema } from 'src/members/schema/members.schema';
import { PayrollSchema } from 'src/pay-roll/schema/Payroll.schema';
import { ConfigModule } from '@nestjs/config';
import { EarningsSchema } from './schema/earnings.schema';
import { ProjectSchema } from 'src/projects/schema/projects.schema';
import { TeamsSchema } from 'src/teams/schema/teams.schema';

@Module({
  imports: [
    MembersModule,
    DepartmentModule,
    ConfigModule,
    MongooseModule.forFeature([
      { name: 'PayRoll', schema: PayrollSchema },
      { name: 'Earnings', schema: EarningsSchema },
      { name: 'Department', schema: DepartmentSchema },
      { name: 'Member', schema: MemberSchema },
      { name: 'Project', schema: ProjectSchema },
      { name: 'Teams', schema: TeamsSchema },
    ]),
  ],
  controllers: [EarningsController],
  providers: [EarningsService],
})
export class EarningsModule {}
