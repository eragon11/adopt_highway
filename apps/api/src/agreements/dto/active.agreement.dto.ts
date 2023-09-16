import { AutoMap } from '@automapper/classes';

export class ActiveAgreementDto {
    @AutoMap()
    aahSegmentId: string;

    @AutoMap()
    agreementId: number;

    @AutoMap()
    alternateContactEmail: string;

    @AutoMap()
    alternateContactName: string;

    @AutoMap()
    alternateContactPhoneNumber: string;

    @AutoMap()
    countyName: string;

    @AutoMap()
    countyNumber: number;

    @AutoMap()
    districtCoordinatorName: string;

    @AutoMap()
    districtName: string;

    @AutoMap()
    districtNumber: number;

    @AutoMap()
    endDate: string;

    @AutoMap()
    groupName: string;

    @AutoMap()
    groupNumberOfVolunteers: number;

    @AutoMap()
    maintenanceSectionName: string;

    @AutoMap()
    maintenanceSectionNumber: number;

    @AutoMap()
    pickupScheduledDates: string[];

    @AutoMap()
    pickupsPerYear: number;

    @AutoMap()
    primaryContactEmail: string;

    @AutoMap()
    primaryContactName: string;

    @AutoMap()
    primaryContactPhoneNumber: string;

    @AutoMap()
    remainingPickups: string;

    @AutoMap()
    renewalDate: string;

    @AutoMap()
    scheduledPickups: number;

    @AutoMap()
    segmentLength: string;

    @AutoMap()
    segmentName: string;

    @AutoMap()
    startDate: string;

    @AutoMap()
    status: string;

    @AutoMap()
    totalPickups: number;

    @AutoMap()
    maintenanceCoordinatorNames: string[];

    @AutoMap()
    nextPickupScheduledDate: string;

    @AutoMap()
    documentUrl: string;

    @AutoMap()
    signLine1: string;

    @AutoMap()
    signLine2: string;

    @AutoMap()
    signLine3: string;

    @AutoMap()
    signLine4: string;
}
