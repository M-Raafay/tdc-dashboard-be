import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {

  @Prop()
  admin_name: string;

  @Prop({unique:true})
  email: string;

  @Prop()
  password: string;
  
  @Prop({default: 'admin'})
  role: string;
  
}

export const AdminSchema = SchemaFactory.createForClass(Admin);