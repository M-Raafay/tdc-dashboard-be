import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Project } from 'src/projects/schema/projects.schema';

export type MemberDocument = HydratedDocument<Member>;

@Schema()
export class Member {

  _id: mongoose.Schema.Types.ObjectId

  // @Prop({unique:true})
  // member_id: string;

  @Prop()
  username: string;

  @Prop()
  first_name: string;

  @Prop()
  last_name: string;

  @Prop({unique:true})
  email: string;

  @Prop({default:12345})
  password:string

  @Prop()
  tech_stack: string;

  @Prop({default:""})
  team_lead: string;

  @Prop({default:0})
  expense: number;

  @Prop({default: 'user'})
  role:string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }] })
  projects: Array<Project>;
   //  projects: Types.ObjectId[];

  @Prop({default: Date.now })
  createdAt: Date

}

export const MemberSchema = SchemaFactory.createForClass(Member);