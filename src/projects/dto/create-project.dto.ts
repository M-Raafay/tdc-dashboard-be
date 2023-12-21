import { IsDate, IsEnum, IsISO8601, IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { DurationUnit, RateType, Status } from "../schema/projects.schema"

export class CreateProjectDto {
  _id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  stack: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  team_lead: string;

  // @IsString()
  // @IsNotEmpty()
  // tech_coordinator: string;

  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  sales_coordinator: string;

  @IsMongoId({ each: true })
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
  consultant: string;

  @IsEnum(Status)
  status: Status;

  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(DurationUnit)
  duration_unit: DurationUnit;

  @IsISO8601()
  @IsNotEmpty()
  start_date: Date;

  @IsISO8601()
  @IsNotEmpty()
  end_date: Date;

  @IsString()
  @IsNotEmpty()
  cost: string;
}
