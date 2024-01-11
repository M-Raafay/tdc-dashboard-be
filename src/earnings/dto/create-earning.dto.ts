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
  readonly member: string;

  @IsNotEmpty()
  @IsString()
  readonly department: string;

  @IsNotEmpty()
  @IsString()
  readonly month: string;

  @IsNotEmpty()
  @IsNumber()
  readonly year: number;

  //   @IsNotEmpty()
  //   @IsNumber()
  //   readonly currentSalary: number; // will get from the member table

  @IsOptional()
  @IsNumber()
  readonly totalOvertimeHours: number; //after we will get data from clockify api and will calculate

  @IsOptional()
  @IsNumber()
  readonly totalUnderTimeHours: number; //after we will get data from clockify api and will calculate

  @IsArray()
  readonly projectsAssigned: string[];

  @IsArray()
  readonly projectsWorkedOn: string[];

  @IsNotEmpty()
  @IsNumber()
  readonly contractedHours: number;

  @IsOptional()
  @IsNumber()
  readonly totalDeductions: number;
}
