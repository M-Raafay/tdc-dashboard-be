import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDto } from './create-member.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateMemberDto extends PartialType(CreateMemberDto) {
    _id : string
    
    @IsString()
    @IsNotEmpty()
    member_id :string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    username :string

    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsString()
    TS: string;

    @IsString()
    TL: string;
}
