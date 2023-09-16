import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, Max, MaxDate, MaxLength, Min } from 'class-validator';
import { PickupType } from 'src/common';
import {
    INVALID_ACTUAL_PICKUP_DATE,
    INVALID_PICKUP_MAX_BAGS_COLLECTED,
} from 'src/constants/common.constants';

export class InsertPickupByIdDto {
    @ApiProperty()
    @IsEnum(PickupType)
    type: PickupType;

    @ApiProperty()
    @Type(() => Date)
    @MaxDate(new Date(), {
        message: INVALID_ACTUAL_PICKUP_DATE,
    })
    pickupDate: Date;

    @ApiProperty()
    @Max(1000, {
        message: INVALID_PICKUP_MAX_BAGS_COLLECTED,
    })
    @Min(1)
    numberOfBagsCollected: number;

    @ApiProperty()
    @Max(1000)
    @Min(1)
    numberOfVolunteers: number;

    @ApiProperty()
    @MaxLength(500)
    comments: string;
}
