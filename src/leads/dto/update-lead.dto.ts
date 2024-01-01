import {
  IsBoolean,
  IsDate,
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

export class UpdateLeadDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  // @todo change to datestring // also fix patch api
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

  // @todo change to datestring
  @IsDateString()
  @IsOptional()
  appointment: Date;
  // @todo change to datestring
  @IsDateString()
  @IsOptional()
  call: Date;

  @IsEnum(LeadType)
  @IsOptional()
  leadStatus: LeadType;
}
