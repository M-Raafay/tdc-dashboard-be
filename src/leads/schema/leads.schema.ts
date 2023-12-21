import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/clients/schema/client.schema';
import { Member } from 'src/members/schema/members.schema';

export type LeadDocument = HydratedDocument<Lead>;

@Schema()
export class Lead {
  @Prop()
  name: string;

  @Prop()
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  salesTeamMember: Member;

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

  @Prop({ default: false })
  isColdLead: boolean;

  @Prop({ default: false })
  isWarmLead: boolean;

  @Prop({ default: false })
  isHotLead: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
