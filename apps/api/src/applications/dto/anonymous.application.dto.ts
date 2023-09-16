import { GroupTypes } from 'src/common';

export class AnonymousApplicationDto {
    applicationId: number;

    isSchool: boolean;

    groupName: string;

    groupAddressLine1: string;

    groupAddressLine2?: string;

    groupCity: string;

    groupPostalCode: string;

    groupDescription?: string;

    groupWebsiteUrl?: string;

    estimateNumberOfVolunteers: number;

    groupCountyNumber: number;

    groupType: GroupTypes;

    primaryContactFirstName: string;

    primaryContactLastName: string;

    primaryContactAddressLine1: string;

    primaryContactAddressLine2?: string;

    primaryContactCity: string;

    primaryContactPostalCode: string;

    primaryContactPhoneNumber?: string;

    primaryContactEmail?: string;

    primaryContactCountyNumber?: number;

    secondaryContactFirstName: string;

    secondaryContactLastName: string;

    secondaryContactAddressLine1: string;

    secondaryContactAddressLine2?: string;

    secondaryContactCity: string;

    secondaryContactPostalCode: string;

    secondaryContactPhoneNumber?: string;

    secondaryContactEmail?: string;

    secondaryContactCountyNumber?: number;

    schoolName?: string;

    schoolEmail?: string;

    schoolPhoneNumber?: string;

    requestedHighwayDescription: string;

    requestedAlternateHighwayDescription?: string;

    requestedHighwayCountyNumber: number;

    signLine_1: string;

    signLine_2?: string;

    signLine_3?: string;

    signLine_4?: string;

    status?: string;

    aahSegmentId: number;

    aahRouteName: string;

    applicationToken: string;

    accessToken: string;

    signRejectionComments?: string;

    firstScheduledPickup?: Date;

    agreementStartDate?: Date;

    agreementEndDate?: Date;

    requiredPickupsPerYear?: number;

    lengthOfAdoptedSection?: number;

    cleaningCycleOfAdoptedSection?: number;

    txdotContactUserId?: number;

    txdotContactFullName?: string;

    txdotContactPhoneNumber?: string;

    pickupsStartDate?: Date;

    pickupsEndDate?: Date;
}
