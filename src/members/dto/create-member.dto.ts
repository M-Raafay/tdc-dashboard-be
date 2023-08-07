import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateMemberDto {
    @IsString()
    @IsNotEmpty()
    member_id :string


    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username :string

    @IsString()
    first_name: string;
    
    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsString()
    TS: string;

    @IsString()
    TL: string;

    Projects : string[]
}
