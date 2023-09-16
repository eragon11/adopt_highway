import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';

export class TxDotDto {
    @AutoMap({ typeFn: () => Number })
    id: number;

    @AutoMap({ typeFn: () => String })
    sectionName: string;
}

export class DistrictDto {
    @AutoMap({ typeFn: () => Number })
    id: number;

    @AutoMap({ typeFn: () => String })
    code: string;

    @AutoMap({ typeFn: () => String })
    name: string;

    @AutoMap()
    number: string;
}

export class MaintenanceSectionDto {
    @AutoMap({ typeFn: () => Number })
    id: number;

    @AutoMap({ typeFn: () => Number })
    number: number;

    @AutoMap({ typeFn: () => String })
    name: string;

    @AutoMap({ typeFn: () => Number })
    districtNumber: number;

    @AutoMap({ typeFn: () => String })
    districtName: string;

    @AutoMap({ typeFn: () => String })
    districtAbbreviation: string;
}

export class GroupSponsorDto {
    @AutoMap({ typeFn: () => Number })
    id: number;

    @AutoMap({ typeFn: () => String })
    name: string;

    @AutoMap({ typeFn: () => Number })
    estimatedVolunteerCount: number;

    @AutoMap({ typeFn: () => Date })
    applicationSendDate: Date;

    @AutoMap({ typeFn: () => Date })
    initialContactDate: Date;

    @AutoMap({ typeFn: () => String })
    comment: string;
}

export class OrganizationDto {
    @AutoMap()
    @IsNotEmpty()
    id: number;

    @AutoMap({ typeFn: () => DistrictDto })
    district?: DistrictDto;

    @AutoMap({ typeFn: () => MaintenanceSectionDto })
    maintenanceSection?: MaintenanceSectionDto;

    @AutoMap({ typeFn: () => GroupSponsorDto })
    groupSponsor?: GroupSponsorDto;

    @AutoMap({ typeFn: () => TxDotDto })
    txDot?: TxDotDto;
}
