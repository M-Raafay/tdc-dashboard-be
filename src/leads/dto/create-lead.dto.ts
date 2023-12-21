import {
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsDateString()
  date: Date;

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
  appointment: Date;

  @IsDateString()
  call: Date;
}
