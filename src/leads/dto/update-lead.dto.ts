import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { LeadType } from '../schema/leads.schema';

export class UpdateLeadDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsDate()
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

  @IsDate()
  @IsOptional()
  appointment: Date;

  @IsDate()
  @IsOptional()
  call: Date;

  @IsEnum(LeadType)
  @IsOptional()
  leadStatus: LeadType;
}
