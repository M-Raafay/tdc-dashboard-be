import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { LeadSchema } from './schema/leads.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Lead', schema: LeadSchema }])],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
