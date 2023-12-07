import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Department } from 'src/department/schema/department.schema';
import { Teams } from 'src/teams/schema/teams.schema';

export type MemberDocument = HydratedDocument<Member>;

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  HR = 'HR',
  BUSINESS_MANAGER = 'BUSINESS_MANAGER',
  SALES_AGENT = 'SALES_AGENT',
  TECH = 'TECH',
  HELPER = 'HELPER',
}

@Schema()
export class Member {
  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: Role;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  department: Department; /// add reference to department schema. update dto

  @Prop({ type: Types.ObjectId, ref: 'Teams' })
  teams: Teams; /// add reference to TEAMS  schema array. update dto

  @Prop({ default: false })
  is_departmentHead: boolean;

  @Prop({ default: false })
  is_teamHead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  createdBy: Member;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
