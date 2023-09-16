import { IsEmail, IsNotEmpty, ValidateIf } from 'class-validator';

export class CreateSigningDocumentDto {
    aahRouteName: string;
    applicationToken: string;
    cleaningFrequency: string;
    endDate: string;
    firstPickupDate: string;
    groupId: string;
    groupName: string;
    primaryContactAddress: string;
    primaryContactAddressLine2: string;
    primaryContactCity: string;

    @IsNotEmpty()
    @IsEmail()
    primaryContactEmail: string;
    primaryContactName: string;
    primaryContactPhoneNumber: string;
    primaryContactPostalCode: string;

    @ValidateIf((o) => o.schoolEmail !== '')
    @IsEmail()
    schoolEmail: string;
    schoolName: string;
    schoolPhoneNumber: string;
    schoolRepresentativeName: string;
    secondaryContactAddress: string;
    secondaryContactAddressLine2: string;
    secondaryContactCity: string;

    @IsNotEmpty()
    @IsEmail()
    secondaryContactEmail: string;
    secondaryContactName: string;
    secondaryContactPhoneNumber: string;
    secondaryContactPostalCode: string;
    segmentId: string;
    segmentLength: string;
    signLine_1_1: string;
    signLine_1_10: string;
    signLine_1_11: string;
    signLine_1_12: string;
    signLine_1_13: string;
    signLine_1_2: string;
    signLine_1_3: string;
    signLine_1_4: string;
    signLine_1_5: string;
    signLine_1_6: string;
    signLine_1_7: string;
    signLine_1_8: string;
    signLine_1_9: string;
    signLine_2_1: string;
    signLine_2_10: string;
    signLine_2_11: string;
    signLine_2_12: string;
    signLine_2_13: string;
    signLine_2_2: string;
    signLine_2_3: string;
    signLine_2_4: string;
    signLine_2_5: string;
    signLine_2_6: string;
    signLine_2_7: string;
    signLine_2_8: string;
    signLine_2_9: string;
    signLine_3_1: string;
    signLine_3_10: string;
    signLine_3_11: string;
    signLine_3_12: string;
    signLine_3_13: string;
    signLine_3_2: string;
    signLine_3_3: string;
    signLine_3_4: string;
    signLine_3_5: string;
    signLine_3_6: string;
    signLine_3_7: string;
    signLine_3_8: string;
    signLine_3_9: string;
    signLine_4_1: string;
    signLine_4_10: string;
    signLine_4_11: string;
    signLine_4_12: string;
    signLine_4_13: string;
    signLine_4_2: string;
    signLine_4_3: string;
    signLine_4_4: string;
    signLine_4_5: string;
    signLine_4_6: string;
    signLine_4_7: string;
    signLine_4_8: string;
    signLine_4_9: string;
    startDate: string;

    @IsNotEmpty()
    @IsEmail()
    txDOTContactEmail: string;

    @IsNotEmpty()
    txDOTContactName: string;

    @IsNotEmpty()
    txDOTContactPhone: string;
}
