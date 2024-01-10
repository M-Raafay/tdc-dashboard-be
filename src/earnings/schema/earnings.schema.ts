// earnings.model.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Earnings extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member', default: null })
  member: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    default: null,
  })
  department: mongoose.Types.ObjectId;

  @Prop({ required: true })
  month: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true })
  basicSalary: number;

  // @Prop()
  // overtimeRate: number;

  @Prop()
  projectsAssigned: string[]; // Array of Project IDs assigned to the member

  @Prop()
  projectsWorkedOn: string[]; // Array of Project IDs assigned to the member
  // Additional fields

  @Prop({ required: true })
  contractedHours: number;

  @Prop()
  totalOvertimeHours: number;

  @Prop()
  totalUnderTimeHours: number;

  @Prop()
  totalWorkedHours: number;

  @Prop()
  totalEarnings: number; //representing gross salary

  @Prop()
  totalDeductions: number;

  @Prop({ required: true })
  netSalary: number;

  // // Timestamps
  // createdAt: Date;
  // updatedAt: Date;
}

export const EarningsSchema = SchemaFactory.createForClass(Earnings);
