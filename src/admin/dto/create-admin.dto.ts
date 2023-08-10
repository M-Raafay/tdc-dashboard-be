import { IsNotEmpty, IsString, MinLength } from "class-validator"

export class CreateAdminDto {
    @IsString()
    @IsNotEmpty()
    admin_name : string

    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    password: string
}
