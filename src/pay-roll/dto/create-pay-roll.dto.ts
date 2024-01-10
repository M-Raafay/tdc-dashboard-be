// export class CreatePayRollDto {}
// payroll.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsMongoId } from 'class-validator';


export class CreatePayRollDto {

  // @IsMongoId()
  @IsNotEmpty()
  member: string; // Assuming the member ID will be sent as a string

  @IsNotEmpty()
  @IsString()
  accountTitle: string;

  @IsNotEmpty()
  @IsString()
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
