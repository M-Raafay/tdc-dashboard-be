import {
  IsBoolean,
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

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
  appointment: Date;

  @IsDate()
  call: Date;

  @IsBoolean()
  @IsOptional()
  isColdLead: boolean;

  @IsBoolean()
  @IsOptional()
  isWarmLead: boolean;

  @IsBoolean()
  @IsOptional()
  isHotLead: boolean;
}
