import { ApiProperty } from '@nestjs/swagger';
import { BaseReportQueryDto } from '../utils/report.utils';
import { SegmentReportOrderByProperties } from './segment-report.query';

/**
 * Abstract class serving as the base query dto for Agreements By Renewal Date
 */
export abstract class SegmentReportQueryDto extends BaseReportQueryDto {
    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: SegmentReportOrderByProperties,
        default: SegmentReportOrderByProperties.segmentId,
    })
    orderBy: SegmentReportOrderByProperties;
}

/**
 * DTO for admin query
 */
export class AdminReportQueryDto extends SegmentReportQueryDto {
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
export class DistrictReportQueryDto extends SegmentReportQueryDto {
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
export class OfficeReportQueryDto extends SegmentReportQueryDto {
    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}
