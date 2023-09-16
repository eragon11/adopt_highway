import { AutoMap } from '@automapper/classes';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Agreement } from './agreement.entity';
import { MaintenanceSection } from './maintenancesection.entity';

@Entity({ name: 'AAH_GIS_SEGMENTS', schema: 'gis' }) // verify that this is the correct schema and name - where/how does the entity know to "connect" to this table?
export class Segment {
    @Column([{ name: 'GlobalID' }])
    @AutoMap({ typeFn: () => String })
    globalId: string;

    @PrimaryColumn({ name: 'OBJECTID' })
    @AutoMap({ typeFn: () => Number })
    objectId: number;

    @Column({ name: 'AAH_SEGMENT_ID' })
    @AutoMap({ typeFn: () => String })
    aahSegmentId: string;

    @Column({ name: 'SEGMENT_STATUS' })
    @AutoMap({ typeFn: () => String })
    segmentStatus: string;

    @Column({ name: 'FROM_TO_DESC' })
    @AutoMap({ typeFn: () => String })
    fromToDesc: string;

    @Column({ name: 'SEGMENT_LENGTH_MILES' })
    @AutoMap({ typeFn: () => Number })
    segmentLengthMiles: number;

    @Column({ name: 'AAH_ROUTE_NAME' })
    @AutoMap({ typeFn: () => String })
    aahRouteName: string;

    @Column({ name: 'DIST_NM' })
    @AutoMap({ typeFn: () => String })
    districtName: string;

    @Column({ name: 'DIST_ABRVN' })
    @AutoMap({ typeFn: () => String })
    districtAbbreviation: string;

    @Column({ name: 'DIST_NBR' })
    @AutoMap({ typeFn: () => Number })
    districtNumber: number;

    @Column({ name: 'CNTY_NM' })
    @AutoMap({ typeFn: () => String })
    countyName: string;

    @Column({ name: 'CNTY_NBR' })
    @AutoMap({ typeFn: () => Number })
    countyNumber: number;

    @Column({ name: 'MNT_OFFICE_NM' })
    @AutoMap({ typeFn: () => String })
    maintenanceOfficeName: string;

    @Column({ name: 'MNT_SEC_NBR' })
    @AutoMap({ typeFn: () => Number })
    maintenanceOfficeNumber: number;

    @Column({ name: 'CREATED_BY' })
    @AutoMap({ typeFn: () => String })
    createdBy: string;

    @Column({ name: 'CREATED_ON' })
    @AutoMap({ typeFn: () => Date })
    createdOn: Date;

    @Column({ name: 'UPDATED_BY' })
    @AutoMap({ typeFn: () => String })
    updateBy: string;

    @Column({ name: 'UPDATED_ON' })
    @AutoMap({ typeFn: () => Date })
    updatedOn: Date;

    @Column({ name: 'SEGMENT_PREFIX' })
    @AutoMap({ typeFn: () => String })
    segmentPrefix: string;

    @Column({ name: 'SEGMENT_RTE_NUMBER' })
    @AutoMap({ typeFn: () => String })
    segmentRouteNumber: string;

    @Column({ name: 'SEGMENT_SUFFIX' })
    @AutoMap({ typeFn: () => String })
    segmentSuffix: string;

    @Column({ name: 'SEGMENT_ROADBED' })
    @AutoMap({ typeFn: () => String })
    segmentRoadbed: string;

    @Column({ name: 'SEGMENT_BOUNDS' })
    @AutoMap({ typeFn: () => String })
    segmentBounds: string;

    @Column({ name: 'SEGMENT_FROM_LAT' })
    @AutoMap({ typeFn: () => Number })
    segmentFromLatitude: number;

    @Column({ name: 'SEGMENT_FROM_LONG' })
    @AutoMap({ typeFn: () => Number })
    segmentFromLongitude: number;

    @Column({ name: 'SEGMENT_TO_LAT' })
    @AutoMap({ typeFn: () => Number })
    segmentToLatitude: number;

    @Column({ name: 'SEGMENT_TO_LONG' })
    @AutoMap({ typeFn: () => Number })
    segmentToLongitude: number;

    @Column({ name: 'REF_MARKER_FROM' })
    @AutoMap({ typeFn: () => String })
    referenceMarkerFrom: string;

    @Column({ name: 'REF_MARKER_TO' })
    @AutoMap({ typeFn: () => String })
    referenceMarkerTo: string;

    @Column({ name: 'BEGIN_DFO' })
    @AutoMap({ typeFn: () => Number })
    beginDistanceFromOrigin: number;

    @Column({ name: 'END_DFO' })
    @AutoMap({ typeFn: () => Number })
    endDistanceFromOrigin: number;

    @Column({ name: 'GROUP_NAME' })
    @AutoMap({ typeFn: () => String })
    groupName: string;

    @Column({ name: 'UNAVAILABLE_REASON_FIELD' })
    @AutoMap({ typeFn: () => String })
    unavailableReason: string;

    @Column({ name: 'DEACTIVATED_REASON_FIELD' })
    @AutoMap({ typeFn: () => String })
    deactivatedReason: string;

    @Column({ name: 'MAINTAINANCE_OFFICER_EMAIL' })
    @AutoMap({ typeFn: () => String })
    maintainanceOfficerEmail: string;

    @Column({ name: 'DISTRICT_COORDINATOR_EMAIL' })
    @AutoMap({ typeFn: () => String })
    districtCoordinatorEmail: string;

    @Column({ name: 'DEACTIVATE_OTHER' })
    @AutoMap({ typeFn: () => String })
    deactivateOther: string;

    @Column({ name: 'UNAVAILABLE_OTHER' })
    @AutoMap({ typeFn: () => String })
    unavailableOther: string;

    @Column({ name: 'TXDOT_ROUTE_NAME' })
    @AutoMap({ typeFn: () => String })
    txdotRouteName: string;

    @Column({ name: 'ORGANIZATION_ID' })
    @AutoMap({ typeFn: () => Number })
    organizationId: number;

    maintenanceSection?: MaintenanceSection;
    agreement?: Agreement;
}
