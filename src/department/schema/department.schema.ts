import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Member } from 'src/members/schema/members.schema';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema()
export class Department {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  departmentHead: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  createdBy: Member;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
