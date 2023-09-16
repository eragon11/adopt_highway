import { PickupType } from 'src/common';

export class AgreementPickupDto {
    pickupId: number;
    type: PickupType;
    pickupDate: string;
    numberOfBagsCollected: number;
    numberOfVolunteers: number;
    comments: string;
}

/**
 * DTO for the GET /agreements/pickups query for the Pickup Info tab on Active Agreements page
 */
export class AgreementPickupInfo {
    groupId: number;
    groupName: string;
    aahSegmentId: string;
    aahRouteName: string;
    agreementId: number;
    pickups: AgreementPickupDto[];
}
