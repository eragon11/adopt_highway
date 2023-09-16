import {
    convertUsing,
    mapFrom,
    Mapper,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Global, Injectable } from '@nestjs/common';
import { DateConverter } from 'src/automapper/converters/date.converter';
import { SignTextConverter } from 'src/automapper/converters/signText.converter';
import SignReportDto from 'src/dto/signReport.dto';
import { Sign } from 'src/entities/sign.entity';

@Global()
@Injectable()
export class SignReportMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Sign, SignReportDto)
                .forMember(
                    (destination: SignReportDto) => destination.agreementId,
                    mapFrom((src) => src.agreement?.agreementId),
                )
                .forMember(
                    (destination: SignReportDto) => destination.agreementStatus,
                    mapFrom((src) => src.agreement?.status),
                )
                .forMember(
                    (destination: SignReportDto) => destination.districtName,
                    mapFrom(
                        (src) => src.agreement?.segment?.districtName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.groupId,
                    mapFrom((src) => src.agreement?.groupSponsor?.id),
                )
                .forMember(
                    (destination: SignReportDto) => destination.groupName,
                    mapFrom(
                        (src) => src.agreement?.groupSponsor?.name ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.segmentId,
                    mapFrom(
                        (src) => src.agreement?.segment?.aahSegmentId ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.segmentName,
                    mapFrom(
                        (src) => src.agreement?.segment?.aahRouteName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.signName,
                    convertUsing(SignTextConverter, (src) => src),
                )
                .forMember(
                    (destination: SignReportDto) => destination.officeName,
                    mapFrom(
                        (src) =>
                            src.agreement?.segment?.maintenanceOfficeName ??
                            'None',
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.countyName,
                    mapFrom(
                        (src) => src.agreement?.segment?.countyName ?? 'None',
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.statusBeginDate,
                    convertUsing(
                        DateConverter,
                        (src) => src.latestSignStatus?.beginDate,
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.statusEndDate,
                    convertUsing(
                        DateConverter,
                        (src) => src.latestSignStatus?.completionDate,
                    ),
                )
                .forMember(
                    (destination: SignReportDto) => destination.status,
                    mapFrom(
                        (src: Sign) => src.latestSignStatus?.status || 'None',
                    ),
                );
        };
    }
}
