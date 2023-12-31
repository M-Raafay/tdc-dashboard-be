import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Member } from 'src/members/schema/members.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop({ unique: true })
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

  //@Remove
  // @Prop({ type: Types.ObjectId, ref: 'Member' })
  // createdBy: Member;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy: Member;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ default: false })
  isOnBoarded: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
