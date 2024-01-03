import { IsArray, IsDateString, IsMongoId, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  lead: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  client: string;

  @IsString()
  @IsOptional()
  @IsMongoId()
  salesMember: string;

  @IsString()
  @IsNotEmpty()
  taskDiscription: string;

  @IsString()
  taskSideNote: string;

  @IsDateString()
  taskStartDate: Date;

  @IsDateString()
  taskEndDate: Date;

  @IsString()
  @IsMongoId()
  taskSupervisor: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  taskTechResources: string[];

  @IsString()
  @IsOptional()
  taskLink1: string;

  @IsString()
  @IsOptional()
  taskLink2: string;

  @IsString()
  @IsOptional()
  taskLink3: string;
}
