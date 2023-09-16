import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, Max, MaxLength, Min } from 'class-validator';
import { PickupType } from 'src/common';
import { IsAmericanDate } from 'src/reports/utils';

export class UpdatePickupByIdDto {
    @ApiProperty()
    @IsOptional()
    @IsEnum(PickupType)
    type: PickupType;

    @ApiProperty()
    @IsOptional()
    @IsAmericanDate()
    pickupDate: string;

    @ApiProperty()
    @IsOptional()
    @Max(1000)
    @Min(1)
    numberOfBagsCollected: number;

    @ApiProperty()
    @IsOptional()
    @Max(1000)
    @Min(1)
    numberOfVolunteers: number;

    @ApiProperty()
    @IsOptional()
    @MaxLength(500)
    comments: string;
}
