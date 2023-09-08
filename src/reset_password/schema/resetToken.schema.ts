import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Member } from 'src/members/schema/members.schema';

export type TokenDocument = HydratedDocument<Token>;

@Schema()
export class Token {

  _id: mongoose.Schema.Types.ObjectId

  @Prop({ type: Types.ObjectId})
  userId: string;

  @Prop()
  token:string

  @Prop({type: Date, default: Date.now, expires: 300})
  createdAt:string

}

export const TokenSchema = SchemaFactory.createForClass(Token);