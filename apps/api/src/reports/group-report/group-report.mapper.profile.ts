import {
    convertUsing,
    mapFrom,
    Mapper,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Global, Injectable } from '@nestjs/common';
import { StreetAddressConverter } from 'src/automapper/converters/streetAddress.converter';
import { DateConverter } from 'src/automapper/converters/date.converter';
import { UserFullNameConverter } from 'src/automapper/converters/userFullName.converter';
import { GroupReportDto } from 'src/dto/groupReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { SignInstalledConverter } from 'src/automapper/converters/signInstalled.converter';
import { RouteNameConverter } from 'src/automapper/converters/routeName.converter';

@Global()
@Injectable()
export class GroupReportMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Agreement, GroupReportDto)
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.agreementStartDate,
                    convertUsing(DateConverter, (src) => src.beginDate),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.agreementEndDate,
                    convertUsing(DateConverter, (src) => src.endDate),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.agreementId,
                    mapFrom((source: Agreement) => source.agreementId),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.agreementStatus,
                    mapFrom((src) => src.status),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.countyName,
                    mapFrom((src) => src.segment?.countyName ?? 'None'),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.districtName,
                    mapFrom((src) => src.segment?.districtName ?? 'None'),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.maintenanceOfficeName,
                    mapFrom(
                        (src) => src.segment?.maintenanceOfficeName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.groupId,
                    mapFrom((src) => src.groupSponsor?.id),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.groupName,
                    mapFrom((src) => src.groupSponsor?.name.trim()),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.groupType,
                    mapFrom((src) => src.groupSponsor?.type),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.isSignInstalled,
                    convertUsing(
                        SignInstalledConverter,
                        (source) => source.latestSignStatus,
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactName,
                    convertUsing(
                        UserFullNameConverter,
                        (src) => src.groupSponsor?.primaryContact,
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactAddress,
                    convertUsing(
                        StreetAddressConverter,
                        (src) =>
                            src.groupSponsor?.primaryContact
                                ?.primaryMailingAddress ??
                            src.groupSponsor?.primaryContact
                                ?.primaryPhysicalAddress,
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactCity,
                    mapFrom(
                        (src: Agreement) =>
                            (
                                src.groupSponsor?.primaryContact
                                    ?.primaryMailingAddress ??
                                src.groupSponsor?.primaryContact
                                    ?.primaryPhysicalAddress
                            )?.city ?? '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactState,
                    mapFrom(
                        (src: Agreement) =>
                            (
                                src.groupSponsor?.primaryContact
                                    ?.primaryMailingAddress ??
                                src.groupSponsor?.primaryContact
                                    ?.primaryPhysicalAddress
                            )?.state ?? '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactPostalCode,
                    mapFrom(
                        (src: Agreement) =>
                            (
                                src.groupSponsor?.primaryContact
                                    ?.primaryMailingAddress ??
                                src.groupSponsor?.primaryContact
                                    ?.primaryPhysicalAddress
                            )?.postalCode ?? '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactEmail,
                    mapFrom(
                        (src: Agreement) =>
                            src.groupSponsor?.primaryContact?.primaryEmail?.value.trim() ??
                            '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.primaryContactPhone,
                    mapFrom(
                        (src: Agreement) =>
                            src.groupSponsor?.primaryContact?.primaryPhone?.value.trim() ??
                            '',
                    ),
                )

                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactName,
                    convertUsing(
                        UserFullNameConverter,
                        (src) => src.groupSponsor?.secondaryContact,
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactAddress,
                    convertUsing(
                        StreetAddressConverter,
                        (src) =>
                            src.groupSponsor?.secondaryContact
                                ?.primaryMailingAddress ??
                            src.groupSponsor?.secondaryContact
                                ?.primaryPhysicalAddress,
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactCity,
                    mapFrom(
                        (src: Agreement) =>
                            (
                                src.groupSponsor?.secondaryContact
                                    ?.primaryMailingAddress ??
                                src.groupSponsor?.secondaryContact
                                    ?.primaryPhysicalAddress
                            )?.city ?? '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactState,
                    mapFrom(
                        (src: Agreement) =>
                            (
                                src.groupSponsor?.secondaryContact
                                    ?.primaryMailingAddress ??
                                src.groupSponsor?.secondaryContact
                                    ?.primaryPhysicalAddress
                            )?.state ?? '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactPostalCode,
                    mapFrom(
                        (src: Agreement) =>
                            (
                                src.groupSponsor?.secondaryContact
                                    ?.primaryMailingAddress ??
                                src.groupSponsor?.secondaryContact
                                    ?.primaryPhysicalAddress
                            )?.postalCode ?? '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactPhone,
                    mapFrom(
                        (src: Agreement) =>
                            src.groupSponsor?.secondaryContact?.primaryPhone?.value.trim() ??
                            '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) =>
                        destination.secondaryContactEmail,
                    mapFrom(
                        (src) =>
                            src.groupSponsor?.secondaryContact?.primaryEmail?.value?.trim() ??
                            '',
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.segmentLength,
                    mapFrom(
                        (src: Agreement) =>
                            src.segment?.segmentLengthMiles ?? 0.0,
                    ),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.segmentId,
                    mapFrom((src: Agreement) => src.segment?.aahSegmentId),
                )
                .forMember(
                    (destination: GroupReportDto) => destination.segmentName,
                    convertUsing(
                        RouteNameConverter,
                        (src) => src.segment?.aahRouteName,
                    ),
                );
        };
    }
}
