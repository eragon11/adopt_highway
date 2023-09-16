import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsOptional,
    Matches,
    Max,
    MaxLength,
    Min,
    IsInt,
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
 * DTO for creating new applications
 */
export class CreateApplicationDto {
    @ApiProperty()
    @IsBoolean()
    isSchool: boolean;

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
    @MaxLength(GROUP_NAME_COLUMN_LENGTH, {
        message: `Group names must be ${GROUP_NAME_COLUMN_LENGTH} characters or less`,
    })
    groupName: string;

    @ApiProperty()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Address Line 1 must be  ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    groupAddressLine1: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Address Line 2 must be  ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    groupAddressLine2?: string;

    @ApiProperty()
    @MaxLength(CITY_COLUMN_LENGTH, {
        message: `City must be ${CITY_COLUMN_LENGTH} characters or less`,
    })
    groupCity: string;

    @ApiProperty()
    @MaxLength(POSTAL_CODE_COLUMN_LENGTH, {
        message: `Group postal code must be ${POSTAL_CODE_COLUMN_LENGTH} characters or less`,
    })
    @Matches(PostalCodeRegEx, {
        message: 'Group postal code is invalid',
    })
    groupPostalCode: string;

    @ApiProperty()
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
    @IsInt()
    @IsPositive({
        message: `Est. nubmer of volunteers must be a positive number`,
    })
    @Max(GROUP_NUMBER_VOLUNTEERS_COLUMN_LENGTH, {
        message: `The maximum number of volunteers is ${GROUP_NUMBER_VOLUNTEERS_COLUMN_LENGTH}`,
    })
    estimateNumberOfVolunteers: number;

    @ApiProperty()
    @Min(1)
    @Max(254)
    @IsInt({ message: `County numbers are between 1 and 254` })
    groupCountyNumber: number;

    @ApiProperty()
    @IsEnum(GroupTypes, { message: 'Please pick a valid group type' })
    groupType: GroupTypes;

    @ApiProperty()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: `Primary first name must be ${CONTACT_NAME_COLUMN_LENGTH} characters or less`,
    })
    primaryContactFirstName: string;

    @ApiProperty()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: `Primary last name must be  ${CONTACT_NAME_COLUMN_LENGTH} characters or less`,
    })
    primaryContactLastName: string;

    @ApiProperty()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Primary contact address line 1 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    primaryContactAddressLine1: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Primary contact address line 2 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    primaryContactAddressLine2?: string;

    @ApiProperty()
    @MaxLength(CITY_COLUMN_LENGTH, {
        message: `Primary contact city must be ${CITY_COLUMN_LENGTH} characters or less`,
    })
    primaryContactCity: string;

    @ApiProperty()
    @MaxLength(POSTAL_CODE_COLUMN_LENGTH, {
        message: `Primary postal code must be ${POSTAL_CODE_COLUMN_LENGTH} characters or less`,
    })
    @Matches(PostalCodeRegEx, {
        message: 'Primary contact postal code is invalid',
    })
    primaryContactPostalCode: string;

    @ApiProperty()
    @Matches(TelephoneRegEx, {
        message: 'Primary contact phone number is invalid',
    })
    primaryContactPhoneNumber?: string;

    @ApiProperty()
    @MaxLength(EMAIL_COLUMN_LENGTH, {
        message: `Primary contact email must be ${EMAIL_COLUMN_LENGTH} characters or less`,
    })
    @IsEmail({}, { message: 'Primary contact email must be a valid email' })
    primaryContactEmail?: string;

    @ApiProperty()
    @Min(1)
    @Max(254)
    @IsInt({
        message:
            'Primary county numbers are between 1 and 254 and are required',
    })
    primaryContactCountyNumber?: number;

    @ApiProperty()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: 'Secondary first name must be 30 characters or less',
    })
    secondaryContactFirstName: string;

    @ApiProperty()
    @MaxLength(CONTACT_NAME_COLUMN_LENGTH, {
        message: `Secondary last name must be ${CONTACT_NAME_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactLastName: string;

    @ApiProperty()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Secondary contact address line 1 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactAddressLine1: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(ADDRESS_LINE_COLUMN_LENGTH, {
        message: `Secondary contact address line 2 must be ${ADDRESS_LINE_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactAddressLine2?: string;

    @ApiProperty()
    @MaxLength(CITY_COLUMN_LENGTH, {
        message: `Secondary contact city must be ${CITY_COLUMN_LENGTH} characters or less`,
    })
    secondaryContactCity: string;

    @ApiProperty()
    @IsOptional()
    @Matches(PostalCodeRegEx, {
        message: 'Secondary contact postal code is invalid',
    })
    secondaryContactPostalCode: string;

    @ApiProperty()
    @Matches(TelephoneRegEx, {
        message: 'Secondary contact phone number is invalid',
    })
    secondaryContactPhoneNumber?: string;

    @ApiProperty()
    @MaxLength(EMAIL_COLUMN_LENGTH, {
        message: `Secondary contact email must be ${EMAIL_COLUMN_LENGTH} characters or less`,
    })
    @IsEmail({}, { message: 'Secondary contact email must be a valid email' })
    secondaryContactEmail?: string;

    @ApiProperty()
    @Min(1)
    @Max(254)
    @IsInt({
        message:
            'Secondary county numbers are between 1 and 254 and are required',
    })
    secondaryContactCountyNumber?: number;

    @ApiProperty()
    @MaxLength(REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH, {
        message: `Requested highway description must be ${REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH} characters or less`,
    })
    requestedHighwayDescription: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH, {
        message: `Requested alternative highway description must be ${REQUESTED_HIGHWAY_DESC_COLUMN_LENGTH} characters or less`,
    })
    requestedAlternateHighwayDescription?: string;

    @ApiProperty()
    @Min(1)
    @Max(254)
    @IsInt({
        message:
            'Requested highway county numbers are between 1 and 254 and are required',
    })
    requestedHighwayCountyNumber: number;

    @ApiProperty()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 1 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    signLine_1: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 2 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    signLine_2?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 3 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    signLine_3?: string;

    @ApiProperty()
    @MaxLength(SIGN_NAME_LINE_COLUMN_LENGTH, {
        message: `Sign line 4 must be ${SIGN_NAME_LINE_COLUMN_LENGTH} characters or less`,
    })
    @IsOptional()
    signLine_4?: string;
}
