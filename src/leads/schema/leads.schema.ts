import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Member } from 'src/members/schema/members.schema';

export type LeadDocument = HydratedDocument<Lead>;

export enum LeadType {
  HOT = 'HOT',
  WARM = 'WARM',
  COLD = 'COLD',
}
@Schema()
export class Lead {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  date: Date;

  //@TODO make it embedded
  // @Prop({ type: mongoose.Schema.Types.Mixed })
  @Prop({ type: Types.ObjectId, ref: 'Member' })
  salesTeamMember: Member;

  //@Prop({ type: mongoose.Schema.Types.Mixed })
  @Prop({ type: Types.ObjectId, ref: 'Client' })
  client: Client;

  @Prop()
  linkJobApplied: string;

  @Prop()
  jobDescription: string;

  @Prop()
  sentDescription: string;

  @Prop()
  appointment: Date;

  @Prop()
  call: Date;

  @Prop()
  leadStatus: LeadType;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy: Member;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
