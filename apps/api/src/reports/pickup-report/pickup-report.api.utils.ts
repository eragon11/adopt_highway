import { ApiProperty } from '@nestjs/swagger';
import { BaseReportQueryDto } from '../utils/report.utils';
import { PickupReportOrderByProperties } from './pickup-report.query';

/**
 * Abstract class serving as the base query dto for Agreements By Renewal Date
 */
export abstract class PickupReportQueryDto extends BaseReportQueryDto {
    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: PickupReportOrderByProperties,
        default: PickupReportOrderByProperties.pickupId,
    })
    orderBy: PickupReportOrderByProperties;
}

/**
 * DTO for admin query
 */
export class AdminReportQueryDto extends PickupReportQueryDto {
    @ApiProperty({
        name: 'districtNumber',
        type: Number,
        minimum: 1,
        maximum: 25,
        required: false,
    })
    districtNumber: number;

    @ApiProperty({
        name: 'officeNumber',
        type: Number,
        minimum: 1,
        maximum: 50,
        required: false,
    })
    officeNumber: number;

    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}

/**
 * DTO for district query
 */
export class DistrictReportQueryDto extends PickupReportQueryDto {
    @ApiProperty({
        name: 'officeNumber',
        type: Number,
        minimum: 1,
        maximum: 50,
        required: false,
    })
    officeNumber: number;

    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}

/**
 * DTO for office query
 */
export class OfficeReportQueryDto extends PickupReportQueryDto {
    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}
