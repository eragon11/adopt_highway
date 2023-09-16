import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { RenewalStatus } from 'src/common';
import { BaseFilterAndSortableQueryDto } from 'src/utils';

export enum RenewalAgreementSortProps {
    districtName,
    officeName,
    countyName,
    agreementEndDate,
    groupName,
    aahRouteName,
    pickupCount,
    aahSegmentId,
    renewalDaysRemaining,
    renewalNoticeSent,
}

export class RenewalAgreementDto {
    @AutoMap({ typeFn: () => Number })
    agreementId: number;

    @AutoMap()
    districtName: string;

    @AutoMap({ typeFn: () => Number })
    districtNumber: number;

    @AutoMap()
    officeName: string;

    @AutoMap({ typeFn: () => Number })
    officeNumber: number;

    @AutoMap()
    countyName: string;

    @AutoMap({ typeFn: () => Number })
    countyNumber: number;

    @AutoMap({ typeFn: () => Date })
    agreementEndDate: Date;

    @AutoMap()
    groupName: string;

    @AutoMap()
    aahRouteName: string;

    @AutoMap()
    pickupCount: string;

    @AutoMap()
    aahSegmentId: string;

    @AutoMap({ typeFn: () => Number })
    renewalDaysRemaining: number;

    @AutoMap({ typeFn: () => Number })
    renewalNoticeSent: boolean;

    renewalStatus: string;
}

export class RewewalAgreementsQueryDto extends BaseFilterAndSortableQueryDto<RenewalAgreementDto> {
    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: RenewalAgreementSortProps,
        default: 'agreementEndDate',
    })
    orderBy: keyof RenewalAgreementDto;

    @ApiProperty({
        name: 'renewalStatus',
        enum: RenewalStatus,
        required: false,
    })
    renewalStatus: RenewalStatus;
}
