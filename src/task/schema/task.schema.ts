import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Lead } from 'src/leads/schema/leads.schema';
import { Member } from 'src/members/schema/members.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Lead' })
  lead: Lead;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  client: Client;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  createdBy: Member;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  salesMember: Member;

  @Prop()
  taskDiscription: string;

  @Prop()
  taskSideNote: string;

  @Prop()
  taskStartDate: Date;

  @Prop()
  taskEndDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  taskSupervisor: Member;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  taskTechResources: Member[];

  @Prop()
  taskLink1: string;

  @Prop()
  taskLink2: string;

  @Prop()
  taskLink3: string;

  @Prop({ default: false })
  isHotLead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
