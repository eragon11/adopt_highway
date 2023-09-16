import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class SegmentReportDto {
    routeName: string;

    @IsNotEmpty()
    @AutoMap()
    segmentId: string;

    segmentStatus: string;

    agreementStatus: string;

    agreementStartDate: string;

    agreementEndDate: string;

    @IsNotEmpty()
    districtName: string;

    @IsNotEmpty()
    countyName: string;

    @IsNotEmpty()
    maintenanceOfficeName: string;

    segmentFromLat: string;

    segmentFromLong: string;

    segmentToLat: string;

    segmentToLong: string;

    uniqueSegmentId: string;

    createdOnDate: Date;
}
