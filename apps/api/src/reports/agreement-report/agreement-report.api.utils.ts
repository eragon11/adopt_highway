import { ApiProperty } from '@nestjs/swagger';
import { BaseReportQueryDto } from '../utils/report.utils';
import { AgreementReportOrderByProperties } from './agreement-report.query';

/**
 * Abstract class serving as the base query dto for Agreements By Renewal Date
 */
export abstract class AgreementReportQueryDto extends BaseReportQueryDto {
    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: AgreementReportOrderByProperties,
        default: AgreementReportOrderByProperties.agreementBeginDate,
    })
    orderBy: AgreementReportOrderByProperties;
}

/**
 * DTO for admin query
 */
export class AdminReportQueryDto extends AgreementReportQueryDto {
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
export class DistrictReportQueryDto extends AgreementReportQueryDto {
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
export class OfficeReportQueryDto extends AgreementReportQueryDto {
    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}
