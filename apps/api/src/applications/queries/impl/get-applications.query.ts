import { ApiPropertyOptional } from '@nestjs/swagger';
import { User } from 'src/entities';
import { PaginationDto } from 'src/utils/pagination.utils';

export class GetApplicationsQuery extends PaginationDto {
    @ApiPropertyOptional({
        name: 'id',
        required: false,
        default: null,
    })
    id: number;

    @ApiPropertyOptional({
        name: 'createdOn',
        required: false,
    })
    createdOn: Date;

    @ApiPropertyOptional({
        name: 'notModified2Wks',
        required: false,
    })
    notModified2Wks: Date;

    @ApiPropertyOptional({
        name: 'older30Days',
        required: false,
    })
    older30Days: Date;

    @ApiPropertyOptional({
        name: 'groupName',
        required: false,
    })
    groupName: string;

    @ApiPropertyOptional({
        name: 'primaryContactFirstName',
        required: false,
    })
    primaryContactFirstName: string;

    @ApiPropertyOptional({
        name: 'primaryContactLastName',
        required: false,
    })
    primaryContactLastName: string;

    @ApiPropertyOptional({
        name: 'primaryContactFullName',
        required: false,
    })
    primaryContactFullName: string;

    @ApiPropertyOptional({
        name: 'primaryContactEmail',
        required: false,
    })
    primaryContactEmail: string;

    @ApiPropertyOptional({
        name: 'requestedHighwayCountyNumber',
        required: false,
    })
    requestedHighwayCountyNumber: number;

    @ApiPropertyOptional({
        name: 'districtNumber',
        required: false,
    })
    districtNumber: number;

    @ApiPropertyOptional({
        name: 'officeNumber',
        required: false,
    })
    officeNumber: number;

    @ApiPropertyOptional({
        name: 'applicationStatus',
        required: false,
    })
    applicationStatus: string;

    @ApiPropertyOptional({
        name: 'aahRouteName',
        required: false,
    })
    aahRouteName: string;

    @ApiPropertyOptional({
        name: 'requestedHighwayCountyName',
        required: false,
    })
    requestedHighwayCountyName: string;

    currentUser: User;
}
