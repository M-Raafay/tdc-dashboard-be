import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Details, DetailsSchema } from './details.schema';

export type ProjectDocument = HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop()
  name: string;

  @Prop()
  cordinator: string;

  @Prop({type: [DetailsSchema] , default : []})
  FE : Details[]

  @Prop({type: [DetailsSchema] , default : []})
  BE : string[]

  @Prop({type: [DetailsSchema] , default : []})
  UI : string[]

  @Prop({type: [DetailsSchema] , default : []})
  DEPLOYMENT:string[]

}

export const ProjectSchema = SchemaFactory.createForClass(Project);