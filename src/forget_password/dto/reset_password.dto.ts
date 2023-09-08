import { IsNotEmpty, IsString } from "class-validator"

export class ResetPasswordDto {

    @IsString()
    @IsNotEmpty()
    new_password:string

    @IsString()
    @IsNotEmpty()
    confirm_password:string
}
