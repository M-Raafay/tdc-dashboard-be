import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    admin_name : string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string

    // @IsString()
    // role: string
}
