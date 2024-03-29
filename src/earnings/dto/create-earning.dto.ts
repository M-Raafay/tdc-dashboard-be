// src/earnings/earnings.dto.ts

import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateEarningDto {
  @IsNotEmpty()
  @IsString()
  member: string;

  @IsOptional()
  @IsNumber()
  totalOvertimeHours: number; //after we will get data from clockify api and will calculate

  @IsOptional()
  @IsNumber()
  totalUnderTimeHours: number; //after we will get data from clockify api and will calculate

  @IsArray()
  projectsWorkedOn: string[];

  @IsOptional()
  @IsNumber()
  totalDeductions: number;

}
