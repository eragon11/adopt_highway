import { UserPhoneConverter } from './../../automapper/converters/userFullName.converter';
import {
    Mapper,
    MappingProfile,
    convertUsing,
    mapFrom,
    mapWith,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { DateConverter } from 'src/automapper';
import { Injectable } from '@nestjs/common';
import { Agreement, Pickup, ViewRenewalAgreement } from 'src/entities';
import { ActiveAgreementListDto } from '../dto/active.agreementlist.dto';
import {
    SegmentDistrictCoordinatorNameConverter,
    SegmentMaintenanceCoordinatorNamesConverter,
    UserEmailConverter,
    UserFullNameConverter,
} from '../../automapper';
import { ActiveAgreementDto, RenewalAgreementDto } from '../dto';
import { UserService } from 'src/users/users.service';
import {
    NextScheduledPickupDateConverter,
    NextFourPickupScheduleDatesConverter,
    RemainingPickupsFromYearMonthStringConverter,
    GetDocumentUrlConverter,
} from './converters';
import {
    AgreementPickupInfo,
    AgreementPickupDto,
} from '../dto/agreement.pickup.info.dto';
import { RenewalStatus } from 'src/common';

@Injectable()
export class AgreementsMapperProfile extends AutomapperProfile {
    constructor(
        @InjectMapper() readonly mapper: Mapper,
        private readonly userService: UserService,
    ) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Agreement, ActiveAgreementListDto)
                .forMember(
                    (dest) => dest.agreementId,
                    mapFrom((src) => src.agreementId),
                )
                .forMember(
                    (dest) => dest.startDate,
                    convertUsing(DateConverter, (src) => src.beginDate),
                )
                .forMember(
                    (dest) => dest.endDate,
                    convertUsing(DateConverter, (src) => src.endDate),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((source) => source.groupSponsor.name),
                )
                .forMember(
                    (dest) => dest.contactEmail,
                    convertUsing(
                        UserEmailConverter,
                        (src) => src.groupSponsor?.contacts[0]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.contactName,
                    convertUsing(
                        UserFullNameConverter,
                        (src) => src.groupSponsor?.contacts[0]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.district,
                    mapFrom((source) => source.segment?.districtName ?? 'N/A'),
                )
                .forMember(
                    (dest) => dest.districtNumber,
                    mapFrom(
                        (source) => source.segment?.districtNumber ?? 'N/A',
                    ),
                )
                .forMember(
                    (dest) => dest.district,
                    mapFrom((source) => source.segment?.districtName ?? 'N/A'),
                )
                .forMember(
                    (dest) => dest.maintenanceSectionName,
                    mapFrom(
                        (source) =>
                            source.segment?.maintenanceOfficeName ?? 'N/A',
                    ),
                )
                .forMember(
                    (dest) => dest.maintenanceSectionNumber,
                    mapFrom(
                        (source) =>
                            source.segment?.maintenanceOfficeNumber ?? 'N/A',
                    ),
                )
                .forMember(
                    (dest) => dest.countyNumber,
                    mapFrom((source) => source.segment?.countyNumber),
                )
                .forMember(
                    (dest) => dest.county,
                    mapFrom((source) => source.segment?.countyName ?? 'N/A'),
                )
                .forMember(
                    (dest) => dest.segmentName,
                    mapFrom((source) => source.segment?.aahRouteName ?? 'N/A'),
                )
                .forMember(
                    (dest) => dest.aahSegmentId,
                    mapFrom((source) => source.segment?.aahSegmentId ?? 'N/A'),
                )
                .forMember(
                    (dest) => dest.documentUrl,
                    convertUsing(GetDocumentUrlConverter, (source) => source),
                );

            mapper
                .createMap(Agreement, ActiveAgreementDto)
                .forMember(
                    (dest) => dest.agreementId,
                    mapFrom((src) => src.agreementId),
                )
                .forMember(
                    (dest) => dest.startDate,
                    convertUsing(DateConverter, (src) => src.beginDate),
                )
                .forMember(
                    (dest) => dest.endDate,
                    convertUsing(DateConverter, (src) => src.endDate),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((source) => source?.groupSponsor?.name),
                )
                .forMember(
                    (dest) => dest.primaryContactName,
                    convertUsing(
                        UserFullNameConverter,
                        (src) => src.groupSponsor?.contacts[0]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.primaryContactEmail,
                    convertUsing(
                        UserEmailConverter,
                        (src) => src.groupSponsor?.contacts[0]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.primaryContactPhoneNumber,
                    convertUsing(
                        UserPhoneConverter,
                        (src) => src.groupSponsor?.contacts[0]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.districtNumber,
                    mapFrom(
                        (source) => source.segment?.districtNumber ?? 'None',
                    ),
                )
                .forMember(
                    (dest) => dest.maintenanceSectionName,
                    mapFrom(
                        (source) =>
                            source.segment?.maintenanceOfficeName ?? 'None',
                    ),
                )
                .forMember(
                    (dest) => dest.maintenanceSectionNumber,
                    mapFrom(
                        (source) =>
                            source.segment?.maintenanceOfficeNumber ?? 'None',
                    ),
                )
                .forMember(
                    (dest) => dest.countyNumber,
                    mapFrom((source) => source.segment?.countyNumber),
                )
                .forMember(
                    (dest) => dest.segmentName,
                    mapFrom((source) => source.segment?.aahRouteName ?? 'None'),
                )
                .forMember(
                    (dest) => dest.aahSegmentId,
                    mapFrom((src) => src.segment?.aahSegmentId ?? 'None'),
                )
                .forMember(
                    (dest) => dest.alternateContactEmail,
                    convertUsing(
                        UserEmailConverter,
                        (src) => src.groupSponsor?.contacts[1]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.alternateContactName,
                    convertUsing(
                        UserFullNameConverter,
                        (src) => src.groupSponsor?.contacts[1]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.alternateContactPhoneNumber,
                    convertUsing(
                        UserPhoneConverter,
                        (src) => src.groupSponsor?.contacts[1]?.user,
                    ),
                )
                .forMember(
                    (dest) => dest.countyName,
                    mapFrom((src) => src.segment?.countyName ?? 'None'),
                )
                .forMember(
                    (dest) => dest.districtName,
                    mapFrom((src) => src.segment?.districtName ?? 'None'),
                )
                .forMember(
                    (dest) => dest.districtCoordinatorName,
                    convertUsing(
                        new SegmentDistrictCoordinatorNameConverter(
                            this.userService,
                        ),
                        (src) => src.segment,
                    ),
                )
                .forMember(
                    (dest) => dest.groupNumberOfVolunteers,
                    mapFrom(
                        (src) => src.groupSponsor.estimatedVolunteerCount ?? 0,
                    ),
                )
                .forMember(
                    (dest) => dest.maintenanceCoordinatorNames,
                    convertUsing(
                        new SegmentMaintenanceCoordinatorNamesConverter(
                            this.userService,
                        ),
                        (src) => src.segment,
                    ),
                )
                .forMember(
                    (dest) => dest.pickupScheduledDates,
                    convertUsing(
                        NextFourPickupScheduleDatesConverter,
                        (src) => src,
                    ),
                )
                .forMember(
                    (dest) => dest.pickupsPerYear,
                    mapFrom(
                        (src) =>
                            src.totalNumberOfPickupsPerAgreementTimeline ?? 0,
                    ),
                )
                .forMember(
                    (dest) => dest.remainingPickups,
                    convertUsing(
                        RemainingPickupsFromYearMonthStringConverter,
                        (src) => src.pickupSchedules,
                    ),
                )
                .forMember(
                    (dest) => dest.renewalDate,
                    mapFrom((src) => src.renewalTimeframe ?? 'None'),
                )
                .forMember(
                    (dest) => dest.scheduledPickups,
                    mapFrom((src) => src.pickupSchedules?.length ?? 0),
                )
                .forMember(
                    (dest) => dest.segmentLength,
                    mapFrom(
                        (src) =>
                            src.segment?.segmentLengthMiles?.toFixed(1) ??
                            'None',
                    ),
                )
                .forMember(
                    (dest) => dest.status,
                    mapFrom((src) => src.status),
                )
                .forMember(
                    (dest) => dest.totalPickups,
                    mapFrom((src) => src.pickups?.length ?? 0),
                )
                .forMember(
                    (dest) => dest.nextPickupScheduledDate,
                    convertUsing(
                        NextScheduledPickupDateConverter,
                        (src) => src.pickupSchedules,
                    ),
                )
                .forMember(
                    (dest) => dest.documentUrl,
                    convertUsing(GetDocumentUrlConverter, (src) => src),
                )
                .forMember(
                    (dest) => dest.signLine1,
                    mapFrom((src) => src.sign?.line1?.trim() ?? ''),
                )
                .forMember(
                    (dest) => dest.signLine2,
                    mapFrom((src) => src.sign?.line2?.trim() ?? ''),
                )
                .forMember(
                    (dest) => dest.signLine3,
                    mapFrom((src) => src.sign?.line3?.trim() ?? ''),
                )
                .forMember(
                    (dest) => dest.signLine4,
                    mapFrom((src) => src.sign?.line4?.trim() ?? ''),
                );

            mapper
                .createMap(Pickup, AgreementPickupDto)
                .forMember(
                    (dest) => dest.numberOfBagsCollected,
                    mapFrom((src) => src.bagFillQuantity),
                )
                .forMember(
                    (dest) => dest.comments,
                    mapFrom((src) => src.comments),
                )
                .forMember(
                    (dest) => dest.numberOfVolunteers,
                    mapFrom((src) => src.volunteerCount),
                )
                .forMember(
                    (dest) => dest.pickupDate,
                    convertUsing(DateConverter, (src) => src.actualPickupDate),
                )
                .forMember(
                    (dest) => dest.type,
                    mapFrom((src) => src.type),
                )
                .forMember(
                    (dest) => dest.pickupId,
                    mapFrom((src) => src.id),
                );

            mapper
                .createMap(Agreement, AgreementPickupInfo)
                .forMember(
                    (dest) => dest.aahSegmentId,
                    mapFrom((src) => src.segment.aahSegmentId),
                )
                .forMember(
                    (dest) => dest.aahRouteName,
                    mapFrom((src) => src.segment.aahRouteName),
                )
                .forMember(
                    (dest) => dest.agreementId,
                    mapFrom((src) => src.agreementId),
                )
                .forMember(
                    (dest) => dest.groupId,
                    mapFrom((src) => src.groupSponsor.id),
                )
                .forMember(
                    (dest) => dest.groupName,
                    mapFrom((src) => src.groupSponsor.name),
                )
                .forMember(
                    (dest) => dest.pickups,
                    mapWith(AgreementPickupDto, Pickup, (src) => src.pickups),
                );

            mapper
                .createMap(ViewRenewalAgreement, RenewalAgreementDto)
                .forMember(
                    (dest) => dest.renewalStatus,
                    mapFrom((src) =>
                        src.renewalNoticeSent
                            ? RenewalStatus.NoticeSent
                            : RenewalStatus.NoticeNotYetSent,
                    ),
                );
        };
    }
}
