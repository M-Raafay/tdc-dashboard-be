import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {
   
  @Prop()
  member_id: string;

  @Prop()
  username: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  email: string;

  @Prop()
  TS: string;

  @Prop()
  TL: string;

  @Prop()
  Projects : string[]

  
}

export const MemberSchema = SchemaFactory.createForClass(Member);