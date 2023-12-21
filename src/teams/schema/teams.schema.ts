import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Department } from 'src/department/schema/department.schema';
import { Member } from 'src/members/schema/members.schema';
import { Project } from 'src/projects/schema/projects.schema';

export type TeamsDocument = HydratedDocument<Teams>;

@Schema()
export class Teams {
  @Prop()
  name: string;

  @Prop()
  technology: string;

  @Prop({ type: Types.ObjectId, ref: 'Department' })
  department: Department;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  team_head: mongoose.Types.ObjectId;

  //@TODO memebers array
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Member' }] })
  members: Member[];

  //@TODO projects array
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }] })
  projects: Project[];

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: 'Member' })
  createdBy: Member;
}

export const TeamsSchema = SchemaFactory.createForClass(Teams);
