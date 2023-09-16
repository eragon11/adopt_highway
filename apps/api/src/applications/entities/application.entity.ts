import { AutoMap } from '@automapper/classes';
import { ApplicationStatus, DocumentStatus, GroupTypes } from 'src/common';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { County } from '../../entities/';

@Entity({ name: 'APPLICATIONS', schema: process.env.DB_SCHEMA })
export class Application {
    @PrimaryGeneratedColumn('increment', { name: 'APPLICATION_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @Column({
        type: 'simple-enum',
        enum: ApplicationStatus,
        default: ApplicationStatus.NotConfirmed,
        name: 'STATUS',
        length: 50,
    })
    status: ApplicationStatus;

    @Column('varchar', {
        name: 'APPLICATION_TOKEN',
        length: 255,
    })
    applicationToken: string;

    @Column('varchar', {
        name: 'ACCESS_TOKEN',
        length: 255,
    })
    accessToken: string;

    @Column('datetime2', {
        name: 'CREATED_ON',
        default: Date.now(),
    })
    createdOn: Date;

    @Column('datetime2', {
        name: 'MODIFIED_ON',
    })
    modifiedOn: Date;

    @Column({
        name: 'NOT_MODIFIED_2WKS',
        insert: false,
        update: false,
        select: false,
    })
    notModified2Wks: Date;

    @Column('datetime2', {
        name: 'EXPIRES_ON',
    })
    expiresOn: Date;

    @Column({
        name: 'OLDER_30DAYS',
        insert: false,
        update: false,
        select: false,
    })
    older30Days: Date;

    @Column('bit', {
        name: 'IS_SCHOOL',
        default: false,
    })
    isSchool: boolean;

    @Column('varchar', {
        name: 'GROUP_NAME',
        length: 200,
    })
    groupName: string;

    @Column('varchar', {
        name: 'GROUP_ADDRESS_LINE1',
        length: 50,
    })
    groupAddressLine1: string;

    @Column('varchar', {
        name: 'GROUP_ADDRESS_LINE2',
        length: 50,
    })
    groupAddressLine2?: string;

    @Column('varchar', {
        name: 'GROUP_CITY',
        length: 50,
    })
    groupCity: string;

    @Column('smallint', {
        name: 'GROUP_COUNTY_NUMBER',
    })
    groupCountyNumber: number;

    @Column('varchar', {
        name: 'GROUP_POSTAL_CODE',
        length: 10,
    })
    groupPostalCode: string;

    @Column('varchar', {
        name: 'GROUP_DESCRIPTION',
        length: 500,
    })
    groupDescription?: string;

    @Column('varchar', {
        name: 'GROUP_WEBSITE_URL',
        length: 255,
    })
    groupWebsiteUrl?: string;

    @Column('smallint', {
        name: 'ESTIMATE_NUMBER_OF_VOLUNTEERS',
        default: 0,
    })
    estimateNumberOfVolunteers: number;

    @Column({
        type: 'simple-enum',
        name: 'GROUP_TYPE',
        length: 30,
        enum: GroupTypes,
        default: GroupTypes.Business,
    })
    groupType: GroupTypes;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_FIRST_NAME',
        length: 30,
    })
    primaryContactFirstName: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_LAST_NAME',
        length: 30,
    })
    primaryContactLastName: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_ADDRESS_LINE1',
        length: 50,
    })
    primaryContactAddressLine1: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_ADDRESS_LINE2',
        length: 50,
    })
    primaryContactAddressLine2?: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_CITY',
        length: 50,
    })
    primaryContactCity: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_POSTAL_CODE',
        length: 10,
    })
    primaryContactPostalCode: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_PHONE_NUMBER',
        length: 20,
    })
    primaryContactPhoneNumber?: string;

    @Column('varchar', {
        name: 'PRIMARY_CONTACT_EMAIL',
        length: 255,
    })
    primaryContactEmail?: string;

    @Column('smallint', {
        name: 'PRIMARY_CONTACT_COUNTY_NUMBER',
    })
    primaryContactCountyNumber: number;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_FIRST_NAME',
    })
    secondaryContactFirstName?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_LAST_NAME',
    })
    secondaryContactLastName?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_ADDRESS_LINE1',
    })
    secondaryContactAddressLine1?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_ADDRESS_LINE2',
    })
    secondaryContactAddressLine2?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_CITY',
        length: 50,
    })
    secondaryContactCity?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_POSTAL_CODE',
        length: 10,
    })
    secondaryContactPostalCode?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_PHONE_NUMBER',
        length: 20,
    })
    secondaryContactPhoneNumber?: string;

    @Column('varchar', {
        name: 'SECONDARY_CONTACT_EMAIL',
        length: 255,
    })
    secondaryContactEmail?: string;

    @Column('smallint', {
        name: 'SECONDARY_CONTACT_COUNTY_NUMBER',
    })
    secondaryContactCountyNumber: number;

    @Column('varchar', {
        name: 'SCHOOL_NAME',
        length: 50,
    })
    schoolName?: string;

    @Column('varchar', {
        name: 'SCHOOL_EMAIL',
        length: 50,
    })
    schoolEmail?: string;

    @Column('varchar', {
        name: 'SCHOOL_PHONE_NUMBER',
    })
    schoolPhoneNumber?: string;

    @Column('varchar', {
        name: 'REQUESTED_HIGHWAY_DESCRIPTION',
        length: 500,
    })
    requestedHighwayDescription: string;

    @Column('varchar', {
        name: 'REQUESTED_ALTERNATE_HIGHWAY_DESCRIPTION',
        length: 500,
    })
    requestedAlternateHighwayDescription: string;

    @Column('smallint', {
        name: 'REQUESTED_HIGHWAY_COUNTY_NUMBER',
    })
    requestedHighwayCountyNumber: number;

    @Column('varchar', {
        name: 'SIGN_LINE_1',
        length: 13,
    })
    signLine_1: string;

    @Column('varchar', {
        name: 'SIGN_LINE_2',
        length: 13,
    })
    signLine_2?: string;

    @Column('varchar', {
        name: 'SIGN_LINE_3',
        length: 13,
    })
    signLine_3?: string;

    @Column('varchar', {
        name: 'SIGN_LINE_4',
        length: 13,
    })
    signLine_4?: string;

    @Column('varchar', {
        name: 'AAH_ROUTE_NAME',
        length: 255,
    })
    aahRouteName: string;

    @Column('int', {
        name: 'AAH_SEGMENT_ID',
    })
    aahSegmentId: number;

    @Column('varchar', {
        name: 'GLOBAL_ID',
        length: 255,
    })
    globalId: string;

    @ManyToOne(() => County, (county) => county.number)
    @JoinColumn({
        name: 'REQUESTED_HIGHWAY_COUNTY_NUMBER',
        referencedColumnName: 'number',
    })
    county: County;

    @Column('varchar', {
        name: 'SIGN_REJECTION_COMMENTS',
        length: 500,
    })
    signRejectionComments?: string;

    @Column('datetime2', {
        name: 'FIRST_SCHEDULED_PICKUP',
    })
    firstScheduledPickup?: Date;

    @Column('datetime2', {
        name: 'AGREEMENT_START_DATE',
    })
    agreementStartDate?: Date;

    @Column('datetime2', {
        name: 'AGREEMENT_END_DATE',
    })
    agreementEndDate?: Date;

    @Column('int', {
        name: 'REQUIRED_PICKUPS_PER_YEAR',
    })
    requiredPickupsPerYear: number;

    @Column('decimal', {
        name: 'LENGTH_OF_ADOPTED_SECTION',
    })
    lengthOfAdoptedSection?: number;

    @Column('int', {
        name: 'CLEANING_CYCLE_OF_ADOPTED_SECTION',
    })
    cleaningCycleOfAdoptedSection?: number;

    @Column('int', {
        name: 'TXDOT_CONTACT_USER_ID',
    })
    txdotContactUserId?: number;

    @Column('varchar', {
        name: 'TXDOT_CONTACT_EMAIL',
        length: 500,
    })
    txdotContactEmail?: string;

    @Column('varchar', {
        name: 'TXDOT_CONTACT_FULL_NAME',
        length: 500,
    })
    txdotContactFullName?: string;

    @Column('varchar', {
        name: 'TXDOT_CONTACT_PHONE_NUMBER',
        length: 500,
    })
    txdotContactPhoneNumber?: string;

    @Column('datetime2', {
        name: 'PICKUPS_START_DATE',
    })
    pickupsStartDate?: Date;

    @Column('datetime2', {
        name: 'PICKUPS_END_DATE',
    })
    pickupsEndDate?: Date;

    @Column('int', {
        name: 'GROUP_ID',
    })
    groupId: number;

    @Column({
        type: 'simple-enum',
        enum: DocumentStatus,
        name: 'MULESOFT_STATUS',
        length: 100,
        nullable: true,
    })
    mulesoftStatus: DocumentStatus;

    @Column({
        name: 'DISTRICT_NAME',
        insert: false,
        update: false,
        select: false,
    })
    districtName: string;

    @Column({
        name: 'DISTRICT_NUMBER',
        insert: false,
        update: false,
        select: false,
    })
    districtNumber: number;

    @Column({
        name: 'DISTRICT_ID',
        insert: false,
        update: false,
        select: false,
    })
    districtId: number;
}
