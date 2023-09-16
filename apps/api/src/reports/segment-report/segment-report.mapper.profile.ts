import {
    Mapper,
    MappingProfile,
    mapFrom,
    convertUsing,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Global, Injectable } from '@nestjs/common';
import { DateConverter } from 'src/automapper/converters/date.converter';
import { RouteNameConverter } from 'src/automapper/converters/routeName.converter';
import { SegmentReportDto } from 'src/dto/segmentReport.dto';
import { Segment } from 'src/entities/segment.entity';

@Global()
@Injectable()
export class SegmentReportMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Segment, SegmentReportDto)
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.createdOnDate,
                    convertUsing(DateConverter, (source) => source.createdOn),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.agreementEndDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.agreement?.endDate,
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.agreementStartDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.agreement?.beginDate,
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.agreementStatus,
                    mapFrom(
                        (source: Segment) => source.agreement?.status ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) => destination.countyName,
                    mapFrom((source: Segment) => source.countyName ?? 'None'),
                )
                .forMember(
                    (destination: SegmentReportDto) => destination.districtName,
                    mapFrom((source: Segment) => source.districtName ?? 'None'),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.maintenanceOfficeName,
                    mapFrom(
                        (source: Segment) =>
                            source.maintenanceOfficeName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) => destination.routeName,
                    convertUsing(RouteNameConverter, (source) => source),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.segmentFromLat,
                    mapFrom(
                        (source) =>
                            source.segmentFromLatitude?.toString() ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.segmentFromLong,
                    mapFrom(
                        (source) =>
                            source.segmentFromLongitude?.toString() ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) => destination.segmentId,
                    mapFrom((source) => source.aahSegmentId),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.uniqueSegmentId,
                    mapFrom((source) => source.globalId),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.segmentStatus,
                    mapFrom(
                        (source: Segment) => source.segmentStatus ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) => destination.segmentToLat,
                    mapFrom(
                        (source: Segment) =>
                            source.segmentToLatitude?.toString() ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SegmentReportDto) =>
                        destination.segmentToLong,
                    mapFrom(
                        (source: Segment) =>
                            source.segmentToLongitude?.toString() ?? 'None',
                    ),
                );
        };
    }
}
