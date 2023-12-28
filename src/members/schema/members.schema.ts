import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { type } from 'os';
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
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  contactNumber: string;

  @Prop()
  role: Role;

  //@TODO Add 2 contact number fields

  @Prop({ type: Types.ObjectId, ref: 'Department', default: null })
  department: Department; /// add reference to department schema. update dto

  // @ TODO make it array of teams
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Teams', default: null }] })
  teams: Teams[]; /// add reference to TEAMS  schema array. update dto

  @Prop({ default: false })
  is_departmentHead: boolean;

  @Prop({ default: false })
  is_teamHead: boolean;

  @Prop()
  emergencyContactName: string;

  @Prop()
  emergencyContactNumber: string;

  @Prop()
  emergencyContactRelation: string;
  //@Remove
  // @Prop({ type: Types.ObjectId, ref: 'Member' })
  // createdBy: Member;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy: Member;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
