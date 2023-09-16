import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/entities';
import { BasePaginationDto } from 'src/utils/pagination.utils';

/**
 * Message for getting active agreements used by GET /agreements/active/
 */
export class GetActiveAgreementsQuery extends BasePaginationDto {
    @ApiPropertyOptional({
        name: 'countyNumber',
        required: false,
        default: null,
    })
    countyNumber: number;

    @ApiPropertyOptional({
        name: 'districtNumber',
        required: false,
        default: null,
    })
    districtNumber: number;

    @ApiPropertyOptional({
        name: 'groupName',
        required: false,
        default: null,
    })
    groupName: string;

    currentUser: User;

    constructor(
        page: number,
        limit: number,
        countyNumber: number,
        districtNumber: number,
        groupName: string,
    ) {
        countyNumber = countyNumber;
        districtNumber = districtNumber;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        groupName = groupName;
        super(page, limit);
    }
}
