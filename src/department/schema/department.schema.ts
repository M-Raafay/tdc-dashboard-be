import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Member, MemberSchema } from 'src/members/schema/members.schema';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema()
export class Department {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Member' })
  departmentHead: mongoose.Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;

  //@Remove
  // @Prop({ type: Types.ObjectId, ref: 'Member' })
  // createdBy: Member;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy: Member;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
