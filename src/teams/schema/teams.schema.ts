import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Department } from 'src/department/schema/department.schema';
import { Member } from 'src/members/schema/members.schema';
import { Project } from 'src/projects/schema/projects.schema';

export type TeamsDocument = HydratedDocument<Teams>;

@Schema()
export class Teams {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
  _id: mongoose.Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  technology: string;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  team_head: mongoose.Types.ObjectId;   //are we can use here a reference table name , instead of writting the moongose id?   -----> cleared after reviewing the service file  create code in which i understand that it(team_head which store a id, which is a member id actually) will be use for running query in memmber model, but one question that, this same mmember can already be a team_head of any other team or not?
  //Same memmber is a team memmber in multiple teams............

  //@TODO memebers array
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  members: Member[];

  //@TODO projects array
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }] })
  projects: Project[];

  @Prop({ default: Date.now })
  createdAt: Date;

  //@Remove
  // @Prop({ type: Types.ObjectId, ref: 'Member' })
  // createdBy: Member;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  createdBy: Member;
}

export const TeamsSchema = SchemaFactory.createForClass(Teams);
