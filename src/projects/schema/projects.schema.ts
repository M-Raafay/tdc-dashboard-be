import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Member } from 'src/members/schema/members.schema';

export type ProjectDocument = HydratedDocument<Project>;

export enum Status {
  Ongoing = 'on-going',
  Completed = 'completed',
}

export enum RateType{
  Hourly = "Hourly",
  Fixed = "Fixed",
  Job = "Job",
  Milestone = "Milestone"
}

export enum DurationUnit {
  Months = 'Months',
  Weeks = 'Weeks',
  Days = 'Days',
}

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop()
  tech_stack: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  team_lead: Member[];

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  sales_coordinator: Member;

  //@REMOVE
  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  // resource_assigned: Array<Member>;

  @Prop()
  platform: string;

  @Prop()
  contract_type: RateType;

  //@TODO add reference of client
  // @Prop()
  // client: string;

  @Prop()
  consultant: string;

  @Prop({ type: String, enum: Object.values(Status), default: Status.Ongoing })
  status: Status;

  @Prop()
  duration: number;

  @Prop()
  duration_unit: DurationUnit;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  cost: string;

  @Prop({ default: '0' })
  hourly_cost: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);