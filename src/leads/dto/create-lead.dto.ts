import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { LeadType } from '../schema/leads.schema';

export class CreateLeadDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date: Date;

  @IsMongoId()
  salesTeamMember: string;

  @IsMongoId()
  @IsOptional()
  client: string;

  @IsUrl()
  linkJobApplied: string;

  @IsString()
  jobDescription: string;

  @IsString()
  sentDescription: string;

  @IsDateString()
  @IsOptional()
  appointment: Date;

  @IsDateString()
  @IsOptional()
  call: Date;

  @IsEnum(LeadType)
  leadStatus: LeadType;
}
