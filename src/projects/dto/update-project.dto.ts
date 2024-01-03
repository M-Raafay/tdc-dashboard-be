import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsDateString, IsEnum, IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DurationUnit, RateType, Status } from '../schema/projects.schema';

export class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  tech_stack: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  team_lead: string;

  // @IsString()
  // @IsNotEmpty()
  // tech_coordinator: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  sales_coordinator: string;

  @IsMongoId({ each: true })
  @IsOptional()
  teams_assigned: string[];

  @IsString()
  @IsNotEmpty()
  platform: string;

  @IsEnum(RateType)
  contract_type: RateType;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  client: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  consultant: string;

  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(DurationUnit)
  duration_unit: DurationUnit;

  //@IsISO8601()
  @IsDateString()
  start_date: Date;

  //@IsISO8601()
  @IsDateString()
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  cost: string;
}
