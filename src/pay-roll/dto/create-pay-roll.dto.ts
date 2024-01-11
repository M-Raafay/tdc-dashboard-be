// export class CreatePayRollDto {}
// payroll.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsMongoId, MaxLength, MinLength } from 'class-validator';


export class CreatePayRollDto {

  // @IsMongoId()
  @IsNotEmpty()
  member: string; // Assuming the member ID will be sent as a string

  @IsNotEmpty()
  @IsString()
  accountTitle: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(13, { message: 'CNIC must be at least 13 characters long' })
  @MaxLength(13, { message: 'CNIC must be at most 13 characters long' })
  cnic: string;
  
  @IsNotEmpty()
  @IsString()
  accountNo: string;

  // @IsNotEmpty()
  // @IsNumber()
  // salary: number;

 
  // @IsMongoId()
  @IsNotEmpty()
  department: string; // Assuming the department ID will be sent as a string
  
}
