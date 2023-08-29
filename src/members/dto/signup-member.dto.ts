import { IsEmail, IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class SignUpDto {
    _id: string

    // @IsString()
    // @IsNotEmpty()
    // member_id :string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username :string

    @IsString()
    @IsNotEmpty()
    first_name: string;
    
    @IsString()
    last_name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password:string

    @IsString()
    tech_stack: string;
}
