import {
    convertUsing,
    mapFrom,
    Mapper,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Global, Injectable } from '@nestjs/common';
import { DateConverter } from 'src/automapper/converters/date.converter';
import { MissedPickupsCountConverter } from 'src/automapper/converters/missedPickupsCount.converter';
import { RouteNameConverter } from 'src/automapper/converters/routeName.converter';
import { PickupReportDto } from 'src/dto/pickupReport.dto';
import { Pickup } from 'src/entities/pickup.entity';

@Global()
@Injectable()
export class PickupReportMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Pickup, PickupReportDto)
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.agreementStartDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.agreement?.beginDate,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.bagQuantityPerGroup,
                    mapFrom((source) => source.bagFillQuantity.toString()),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.county,
                    mapFrom(
                        (source) =>
                            source.agreement?.segment?.countyName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.district,
                    mapFrom(
                        (source) =>
                            source.agreement?.segment?.districtName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.groupId,
                    mapFrom((source) => source.agreement?.groupSponsor?.id),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.groupName,
                    mapFrom(
                        (source) =>
                            source.agreement?.groupSponsor.name ?? 'None',
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.pickupId,
                    mapFrom((source) => source.id),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.lastPickupDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.actualPickupDate,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.maintenanceOffice,
                    mapFrom(
                        (source) =>
                            source.agreement?.segment?.maintenanceOfficeName ??
                            'None',
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.nextPickupDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.nextPickupDate,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.numberOfMiles,
                    mapFrom(
                        (source) =>
                            source.agreement?.segment?.segmentLengthMiles ?? 0,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.numberOfPickupsCompleted,
                    mapFrom((source) => source.totalPickupCount ?? 0),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.numberOfMissedPickups,
                    convertUsing(
                        MissedPickupsCountConverter,
                        (source) => source,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.pickupType,
                    mapFrom((source) => source.type ?? 'None'),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.renewalDate,
                    convertUsing(
                        DateConverter,
                        (source) => source.agreement?.endDate,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.routeName,
                    convertUsing(
                        RouteNameConverter,
                        (source) => source.agreement?.segment,
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) => destination.segmentId,
                    mapFrom(
                        (source) =>
                            source.agreement?.segment?.aahSegmentId ?? 'None',
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.uniqueSegmentId,
                    mapFrom(
                        (source) =>
                            source.agreement?.segment?.globalId ?? 'None',
                    ),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.volunteerCount,
                    mapFrom((source) => source.volunteerCount ?? 0),
                )
                .forMember(
                    (destination: PickupReportDto) =>
                        destination.volumeQuantity,
                    mapFrom((source) => source.volumeQuantity ?? 0),
                );
        };
    }
}
