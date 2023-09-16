import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class UpdatePingUserDto {
    @ApiProperty()
    @IsOptional()
    @MaxLength(255)
    firstName: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(255)
    lastName: string;

    @ApiProperty()
    @IsBoolean()
    enabled: boolean;
}
