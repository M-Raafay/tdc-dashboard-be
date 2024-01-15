// earnings.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Project } from 'src/projects/schema/projects.schema';

@Schema({ timestamps: true })
export class Earnings extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null })
  member: mongoose.Types.ObjectId; //can get deprtment from member model, but will suggest from the payroll table, in case he is at internship than it will get from member table on second option

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  })
  department: mongoose.Types.ObjectId; //can get department from payroll table aginst this member, but in case he is at internship, tahn there  us chance we amde payroll or not, if we will not amke pay roll than we will get it from the member table on second opption.

  @Prop({ required: true })
  month: string; // can get value automatically from system

  @Prop({ required: true })
  year: number; // can get value automatically from system

  @Prop({ required: true })
  currentSalary: number; // will get from the member table

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    ],
  })
  projectsAssigned: Project[];

  @Prop({
    type: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null },
    ],
  })
  projectsWorkedOn: Project[];

  @Prop({ required: true })
  contractedHours: number; // will get from env file

  @Prop({ required: true })
  perHourRate: number; // will get from env file

  @Prop({ required: true, default: 0 })
  totalOvertimeHours: number; //after we will get data from clockify api and will calculate

  @Prop({ required: true, default: 0 })
  totalUnderTimeHours: number; //after we will get data from clockify api and will calculate

  @Prop({ required: true, default: 0 })
  totalWorkedHours: number; //after we will get data from clockify api and will calculate

  @Prop({ required: true, default: 0 })
  totalEarnings: number; //representing gross salary

  @Prop({ required: true, default: 0 })
  totalDeductions: number;

  @Prop({ required: true, default: 0 })
  netSalary: number; //we will calculate
}

export const EarningsSchema = SchemaFactory.createForClass(Earnings);
