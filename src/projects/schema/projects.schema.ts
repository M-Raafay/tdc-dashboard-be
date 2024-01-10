import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Member } from 'src/members/schema/members.schema';
import { Teams } from 'src/teams/schema/teams.schema';

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
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

@Prop() 
  tech_stack: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  team_lead?: Member;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  sales_coordinator: Member;

  //@REMOVE
  // @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  // resource_assigned: Array<Member>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Teams' }] })
  teams_assigned?: Array<Teams>;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  members_assigned?: Array<Member>; // New field members_assigned

  @Prop()
  platform: string;

  @Prop()
  contract_type: RateType;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  client: Client;

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

  //@TODO Consider cost in number and unit as well
  @Prop()
  cost: string;

  @Prop({ default: '0' })
  hourly_cost: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy: Member;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);