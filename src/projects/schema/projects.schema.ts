import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Details, DetailsSchema } from './details.schema';

export type ProjectDocument = HydratedDocument<Project>;

export enum Status {
  Pending = 'pending',
  Completed = 'completed',
}

@Schema()
export class Project {

  
  _id: mongoose.Schema.Types.ObjectId

  @Prop()
  name: string;

  @Prop()
  stack: string;

  @Prop()
  team_lead: string;

  @Prop()
  duration: string;

  @Prop()
  coordinator: string;

  @Prop()
  platform: string;

  @Prop()
  client: string;

  @Prop()
  consultant: string;

  @Prop({ type: String, enum: Object.values(Status), default: Status.Pending })
  status: Status;

  @Prop()
  start_date: Date;

  @Prop()
  end_date: Date;

  @Prop()
  cost: string;

  @Prop({default: Date.now })
  createdAt: Date
}

export const ProjectSchema = SchemaFactory.createForClass(Project);