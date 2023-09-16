import { ApiProperty } from '@nestjs/swagger';
import { BaseReportQueryDto } from '../utils/report.utils';
import { GroupReportOrderByProperties } from './group-report.query';

/**
 * Abstract class serving as the base query dto for Agreements By Renewal Date
 */
export abstract class GroupReportQueryDto extends BaseReportQueryDto {
    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: GroupReportOrderByProperties,
        default: GroupReportOrderByProperties.groupName,
    })
    orderBy: GroupReportOrderByProperties;
}

/**
 * DTO for admin query
 */
export class AdminReportQueryDto extends GroupReportQueryDto {
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
export class DistrictReportQueryDto extends GroupReportQueryDto {
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
    districtNumber: number;
}

/**
 * DTO for office query
 */
export class OfficeReportQueryDto extends GroupReportQueryDto {
    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}
