import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Project } from 'src/projects/schema/projects.schema';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {

  _id: mongoose.Schema.Types.ObjectId

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
  tech_stack: string;

  @Prop()
  team_lead: string;

  // @Prop({type: mongoose.Schema.Types.ObjectId , ref : Project})
  // projects : mongoose.Schema.Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }] })
  projects: Array<Project>;
 //projects: string[];
}

export const MemberSchema = SchemaFactory.createForClass(Member);