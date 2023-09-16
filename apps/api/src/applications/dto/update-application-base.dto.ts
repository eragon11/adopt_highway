import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    Matches,
    Max,
    MaxLength,
    Min,
    IsPositive,
} from 'class-validator';
import { GroupTypes } from 'src/common';
import {
    EMAIL_COLUMN_LENGTH,
    GROUP_NAME_COLUMN_LENGTH,
    ADDRESS_LINE_COLUMN_LENGTH,
    CITY_COLUMN_LENGTH,
    POSTAL_CODE_COLUMN_LENGTH,
    GROUP_DESCRIPTION_COLUMN_LENGTH,
    WEBSITE_COLUMN_LENGTH,
    GROUP_NUMBER_VOLUNTEERS_COLUMN_LENGTH,
    CONTACT_NAME_COLUMN_LENGTH,
    SCHOOL_NAME_COLUMN_LENGTH,
    REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH,
    SIGN_NAME_LINE_COLUMN_LENGTH,
} from 'src/constants/common.constants';
import { PostalCodeRegEx, TelephoneRegEx } from 'src/utils';

/**
 * Updating an application by ID
 */
export class UpdateApplicationBaseDto {
    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isSchool?: boolean;

    @ApiProperty()
    @IsOptional()
    @MaxLength(SCHOOL_NAME_COLUMN_LENGTH, {
        message: `School name must be ${SCHOOL_NAME_COLUMN_LENGTH} characters or less`,
    })
    schoolName?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(EMAIL_COLUMN_LENGTH, {
        message: `School email must be ${EMAIL_COLUMN_LENGTH} characters or less`,
    })
    @IsEmail({}, { message: 'School email must be a valid email' })
    schoolEmail?: string;

    @ApiProperty()
    @IsOptional()
    @Matches(TelephoneRegEx, {
        message: 'School phone number is invalid',
    })
    schoolPhoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(GROUP_NAME_COLUMN_LENGTH, {
        message: `Group names must be ${GROUP_NAME_COLUMN_LENGTH} characters or less`,
    })
    groupName?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Address Line 1 must be  ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    groupAddressLine1?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Address Line 2 must be  ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    groupAddressLine2?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CITY_COLUMN_LENGTH, {
        message: `City must be ${CITY_COLUMN_LENGTH} characters or less`,
    })
    groupCity?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(POSTAL_CODE_COLUMN_LENGTH, {
        message: `Group postal code must be ${POSTAL_CODE_COLUMN_LENGTH} characters or less`,
    })
    @Matches(PostalCodeRegEx, {
        message: 'Group postal code is invalid',
    })
    groupPostalCode?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(GROUP_DESCRIPTION_COLUMN_LENGTH, {
        message: `Group description must be ${GROUP_DESCRIPTION_COLUMN_LENGTH} characters or less`,
    })
    groupDescription?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(WEBSITE_COLUMN_LENGTH, {
        message: `Group website URLs must be ${WEBSITE_COLUMN_LENGTH} characters or less`,
    })
    groupWebsiteUrl?: string;

    @ApiProperty()
    @IsOptional()
    @Min(1)
    @Max(254)
    @IsInt({ message: 'County numbers are between 1 and 254' })
    groupCountyNumber?: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    @IsPositive({
        message: `Est. nubmer of volunteers must be a positive number`,
    })
    @Max(GROUP_NUMBER_VOLUNTEERS_COLUMN_LENGTH, {
        message: `The maximum number of volunteers is ${GROUP_NUMBER_VOLUNTEERS_COLUMN_LENGTH}`,
    })
    estimateNumberOfVolunteers?: number;

    @ApiProperty()
    @IsOptional()
    @IsEnum(GroupTypes, { message: 'Please pick a valid group type' })
    groupType?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: `Primary first name must be ${CONTACT_NAME_COLUMN_LENGTH} characters or less`,
    })
    primaryContactFirstName?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: `Primary last name must be  ${CONTACT_NAME_COLUMN_LENGTH} characters or less`,
    })
    primaryContactLastName?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Primary contact address line 1 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    primaryContactAddressLine1?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Primary contact address line 2 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    primaryContactAddressLine2?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CITY_COLUMN_LENGTH, {
        message: `Primary contact city must be ${CITY_COLUMN_LENGTH} characters or less`,
    })
    primaryContactCity?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(POSTAL_CODE_COLUMN_LENGTH, {
        message: `Primary postal code must be ${POSTAL_CODE_COLUMN_LENGTH} characters or less`,
    })
    primaryContactPostalCode?: string;

    @ApiProperty()
    @IsOptional()
    @Matches(TelephoneRegEx, {
        message: 'Primary contact phone number is invalid',
    })
    primaryContactPhoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(EMAIL_COLUMN_LENGTH, {
        message: `Primary contact email must be ${EMAIL_COLUMN_LENGTH} characters or less`,
    })
    @IsEmail({}, { message: 'Primary contact email must be a valid email' })
    primaryContactEmail?: string;

    @ApiProperty()
    @IsOptional()
    @Min(1)
    @Max(254)
    @IsInt({
        message:
            'Primary county numbers are between 1 and 254 and are required',
    })
    primaryContactCountyNumber?: number;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: 'Secondary first name must be 30 characters or less',
    })
    secondaryContactFirstName?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: `Secondary last name must be ${CONTACT_NAME_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactLastName?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Secondary contact address line 1 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactAddressLine1?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Secondary contact address line 2 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactAddressLine2?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(CITY_COLUMN_LENGTH, {
        message: `Secondary contact city must be ${CITY_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactCity?: string;

    @ApiProperty()
    @IsOptional()
    @Matches(PostalCodeRegEx, {
        message: 'Secondary contact postal code is invalid',
    })
    secondaryContactPostalCode?: string;

    @ApiProperty()
    @IsOptional()
    @Matches(TelephoneRegEx, {
        message: 'Secondary contact phone number is invalid',
    })
    secondaryContactPhoneNumber?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(EMAIL_COLUMN_LENGTH, {
        message: `Secondary contact email must be ${EMAIL_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactEmail?: string;

    @ApiProperty()
    @IsOptional()
    @Min(1)
    @Max(254)
    @IsInt({
        message:
            'Secondary county numbers are between 1 and 254 and are required',
    })
    secondaryContactCountyNumber?: number;

    @ApiProperty()
    @IsOptional()
    @MaxLength(REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH, {
        message: `Requested highway description must be ${REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH} characters or less`,
    })
    requestedHighwayDescription?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH, {
        message: `Requested alternative highway description must be ${REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH} characters or less`,
    })
    requestedAlternateHighwayDescription?: string;

    @ApiProperty()
    @IsOptional()
    @Min(1)
    @Max(254)
    @IsInt({
        message:
            'Requested highway county numbers are between 1 and 254 and are required',
    })
    requestedHighwayCountyNumber?: number;

    @ApiProperty()
    @IsOptional()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 1 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    signLine_1?: string;

    @ApiProperty()
    @IsOptional()
    signLine_2?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 3 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    signLine_3?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 4 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    signLine_4?: string;

    @ApiProperty()
    @IsOptional()
    aahSegmentId?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH, {
        message: `AAH Segment name must be ${REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH} characters or less`,
    })
    aahRouteName?: string;

    @ApiProperty()
    @IsOptional()
    signRejectionComments?: string;

    @ApiProperty()
    @IsOptional()
    firstScheduledPickup?: Date;

    @ApiProperty()
    @IsOptional()
    agreementStartDate?: Date;

    @ApiProperty()
    @IsOptional()
    agreementEndDate?: Date;

    @ApiProperty()
    @IsOptional()
    requiredPickupsPerYear?: number;

    @ApiProperty()
    @IsOptional()
    lengthOfAdoptedSection?: number;

    @ApiProperty()
    @IsOptional()
    cleaningCycleOfAdoptedSection?: number;

    @ApiProperty()
    @IsOptional()
    txdotContactFullName?: string;

    @ApiProperty()
    @IsOptional()
    txdotContactPhoneNumber?: string;

    @ApiProperty()
    @IsEmail({}, { message: 'TxDOT contact email must be a valid email' })
    @IsOptional()
    txdotContactEmail?: string;

    @ApiProperty()
    @IsOptional()
    txdotContactUserId?: number;

    @ApiProperty()
    @IsOptional()
    pickupsStartDate?: Date;

    @ApiProperty()
    @IsOptional()
    pickupsEndDate?: Date;
}
