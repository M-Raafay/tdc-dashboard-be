import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Member } from 'src/members/schema/members.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  emailSecondary: string;

  @Prop()
  contactNumber: string;

  @Prop()
  platform: string;

  @Prop()
  dateContacted: Date;

  @Prop()
  regionLocated: string;

  @Prop()
  contactPlatformLink1: string;

  @Prop()
  contactPlatformLink2: string;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  createdBy: Member;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isOnBoarded: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
