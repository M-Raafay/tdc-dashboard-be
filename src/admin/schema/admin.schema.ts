import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {

  @Prop()
  name: string;

  @Prop()
  password: string;

//   @Prop({enum : ['superadmin', 'admin']})
//   role : string
  
}

export const AdminSchema = SchemaFactory.createForClass(Admin);