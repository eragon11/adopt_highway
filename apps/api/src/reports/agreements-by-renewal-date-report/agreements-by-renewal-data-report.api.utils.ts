import { ApiProperty } from '@nestjs/swagger';
import { BaseReportQueryDto } from '../utils/report.utils';
import { AgreementsByRenewalDateReportOrderByProperties } from './agreements-by-renewal-date-report.query';

/**
 * Abstract class serving as the base query dto for Agreements By Renewal Date
 */
export abstract class AgreementsByRenewalDateReportQueryDto extends BaseReportQueryDto {
    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: AgreementsByRenewalDateReportOrderByProperties,
        default:
            AgreementsByRenewalDateReportOrderByProperties.agreementStartDate,
    })
    orderBy: AgreementsByRenewalDateReportOrderByProperties;
}

/**
 * DTO for admin query
 */
export class AdminReportQueryDto extends AgreementsByRenewalDateReportQueryDto {
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
export class DistrictReportQueryDto extends AgreementsByRenewalDateReportQueryDto {
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
export class OfficeReportQueryDto extends AgreementsByRenewalDateReportQueryDto {
    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        minimum: 1,
        maximum: 255,
        required: false,
    })
    countyNumber: number;
}
