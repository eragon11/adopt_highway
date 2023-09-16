import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class PickupReportDto {
    @IsNotEmpty()
    @AutoMap()
    pickupId: number;

    @AutoMap()
    lastPickupDate: Date;

    @AutoMap()
    nextPickupDate: Date;

    @AutoMap()
    renewalDate: Date;

    @AutoMap()
    @IsNotEmpty()
    district: string;

    @AutoMap()
    @IsNotEmpty()
    county: string;

    @AutoMap()
    @IsNotEmpty()
    maintenanceOffice: string;

    @AutoMap()
    @IsNotEmpty()
    numberOfMissedPickups: string;

    @AutoMap()
    @IsNotEmpty()
    numberOfPickupsCompleted: number;

    @AutoMap()
    @IsNotEmpty()
    groupId: number;

    @AutoMap()
    @IsNotEmpty()
    groupName: string;

    @AutoMap()
    @IsNotEmpty()
    segmentId: string;

    @AutoMap()
    @IsNotEmpty()
    routeName: string;

    @AutoMap()
    @IsNotEmpty()
    pickupType: string;

    @AutoMap()
    @IsNotEmpty()
    bagQuantityPerGroup: string;

    @AutoMap()
    @IsNotEmpty()
    volumeQuantity: number;

    @AutoMap()
    @IsNotEmpty()
    volunteerCount: number;

    @AutoMap()
    agreementStartDate: Date;

    @AutoMap()
    numberOfMiles: number;

    @AutoMap()
    uniqueSegmentId: string;
}
