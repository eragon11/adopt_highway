import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { convertUsing, mapFrom, Mapper } from '@automapper/core';
import { DateConverter } from '../../automapper/converters/date.converter';
import { RouteNameConverter } from '../../automapper/converters/routeName.converter';
import { AgreementReportDto } from 'src/dto/agreementReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { AgreementLengthInProgramConverter } from '../../automapper/converters/lengthInProgram.converter';
import { SignTextConverter } from '../../automapper/converters/signText.converter';

@Injectable()
export class AgreementReportMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile() {
        return (mapper) => {
            mapper
                .createMap(Agreement, AgreementReportDto)
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.agreementBeginDate,
                    convertUsing(
                        DateConverter,
                        (source: Agreement) => source.beginDate,
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.agreementEndDate,
                    convertUsing(
                        DateConverter,
                        (source: Agreement) => source.endDate,
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.agreementStatus,
                    mapFrom((source: Agreement) => source.status ?? 'None'),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.agreementId,
                    mapFrom((source: Agreement) => source.agreementId),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.county,
                    mapFrom(
                        (source: Agreement) =>
                            source.segment?.countyName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.district,
                    mapFrom(
                        (source: Agreement) =>
                            source.segment?.districtName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.groupId,
                    mapFrom((source: Agreement) => source.groupSponsor.id),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.groupName,
                    mapFrom(
                        (source: Agreement) =>
                            source.groupSponsor?.name ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.lengthOfTimeInProgram,
                    convertUsing(
                        AgreementLengthInProgramConverter,
                        (source: Agreement) => source,
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.maintenanceOffice,
                    mapFrom(
                        (source: Agreement) =>
                            source.segment?.maintenanceOfficeName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.routeName,
                    convertUsing(
                        RouteNameConverter,
                        (source: Agreement) => source?.segment ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.uniqueSegmentId,
                    mapFrom((source: Agreement) => source.segment?.globalId),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.segmentId,
                    mapFrom(
                        (source: Agreement) =>
                            source.segment?.aahSegmentId ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) =>
                        destination.segmentStatus,
                    mapFrom(
                        (source: Agreement) =>
                            source.segment?.segmentStatus ?? 'None',
                    ),
                )
                .forMember(
                    (destination: AgreementReportDto) => destination.signText,
                    convertUsing(
                        SignTextConverter,
                        (source: Agreement) => source.sign ?? 'None',
                    ),
                );
        };
    }
}
