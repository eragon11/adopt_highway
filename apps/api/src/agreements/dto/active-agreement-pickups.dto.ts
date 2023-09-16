import { ApiProperty } from '@nestjs/swagger';
import { BaseSortableQueryDto } from 'src/utils';
import { AgreementPickupDto } from './agreement.pickup.info.dto';

export enum AgreementPickupSortProps {
    pickupId,
    type,
    pickupDate,
    numberOfBagsCollected,
    numberOfVolunteers,
    comments,
}

export class ActiveAgreementPickupsByIdQueryDto extends BaseSortableQueryDto<AgreementPickupDto> {
    @ApiProperty({
        name: 'id',
        type: Number,
        description: 'ID of the Agreement',
        required: true,
    })
    id: number;

    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: AgreementPickupSortProps,
        default: 'actualPickupDate',
    })
    orderBy: keyof AgreementPickupDto;
}
