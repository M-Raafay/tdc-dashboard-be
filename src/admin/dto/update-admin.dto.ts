import { PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsString()
    admin_name : string

    @IsEmail()
    email: string
    
    // @IsString()
    // @MinLength(5)
    // password: string

}
