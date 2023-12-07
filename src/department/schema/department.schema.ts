import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Member } from 'src/members/schema/members.schema';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema()
export class Department {
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  department_head: Member;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  createdBy: Member;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
