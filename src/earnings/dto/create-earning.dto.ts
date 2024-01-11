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

  @IsNotEmpty()
  @IsString()
  department: string;

  @IsNotEmpty()
  @IsString()
  month: string;

  @IsNotEmpty()
  @IsNumber()
  year: number;

  //   @IsNotEmpty()
  //   @IsNumber()
  //   readonly currentSalary: number; // will get from the member table

  @IsOptional()
  @IsNumber()
  totalOvertimeHours: number; //after we will get data from clockify api and will calculate

  @IsOptional()
  @IsNumber()
  totalUnderTimeHours: number; //after we will get data from clockify api and will calculate

  @IsArray()
  projectsAssigned: string[];

  @IsArray()
  projectsWorkedOn: string[];

  // @IsNotEmpty()
  // @IsNumber()
  // readonly contractedHours: number;

  @IsOptional()
  @IsNumber()
  totalDeductions: number;
}
