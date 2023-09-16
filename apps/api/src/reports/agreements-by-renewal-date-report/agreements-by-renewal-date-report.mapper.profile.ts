import {
    convertUsing,
    mapFrom,
    Mapper,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Global, Injectable } from '@nestjs/common';
import { AgreementMissedPickupsConverter } from 'src/automapper/converters/agreementMissedPickups';
import { DateConverter } from 'src/automapper/converters/date.converter';
import { AgreementsByRenewalDateReportDto } from 'src/dto/agreementsByRenewalDateReport.dto';
import { Agreement } from 'src/entities/agreement.entity';

@Global()
@Injectable()
export class AgreementsByRenewalDateMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Agreement, AgreementsByRenewalDateReportDto)
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.renewalTimeFrame,
                    mapFrom((src) => src.renewalTimeframe),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.county,
                    mapFrom((src) => src.segment?.countyName ?? 'None'),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.district,
                    mapFrom((src) => src.segment?.districtName ?? 'None'),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.maintenanceOffice,
                    mapFrom(
                        (src) => src.segment?.maintenanceOfficeName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.groupId,
                    mapFrom((src) => src.groupSponsor?.id),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.groupName,
                    mapFrom((src) => src.groupSponsor?.name),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.numberOfMissedPickups,
                    convertUsing(AgreementMissedPickupsConverter, (src) => src),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.agreementStartDate,
                    convertUsing(DateConverter, (src) => src.beginDate),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.agreementEndDate,
                    convertUsing(DateConverter, (src) => src.endDate),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.totalNumberOfPickupsPerAgreementTimeline,
                    mapFrom(
                        (src: Agreement) =>
                            src.totalNumberOfScheduledPickupsPerAgreementTimeline ??
                            0,
                    ),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.agreementInfo,
                    mapFrom((src: Agreement) => src.comment ?? 'None'),
                )
                .forMember(
                    (destination: AgreementsByRenewalDateReportDto) =>
                        destination.agreementId,
                    mapFrom((src: Agreement) => src.agreementId),
                );
        };
    }
}
