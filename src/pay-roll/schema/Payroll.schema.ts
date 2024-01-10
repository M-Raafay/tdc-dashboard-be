// payroll.model.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class PayRoll extends Document {
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
  accountTitle: string;

  @Prop({ required: true })
  cnic: string;

  @Prop({ required: true })
  accountNo: string;

  @Prop({ required: true, default: 0 })
  netSalary: number;

  @Prop({ required: true })
  month: string;
 
  @Prop({ required: true })
  year: number;
}

export const PayrollSchema = SchemaFactory.createForClass(PayRoll);
