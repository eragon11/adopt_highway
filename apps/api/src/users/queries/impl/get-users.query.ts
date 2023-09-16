import { ApiPropertyOptional } from '@nestjs/swagger';
import { ToBoolean } from 'src/decorators';
import { User } from 'src/entities';
import { PaginationDto } from 'src/utils/pagination.utils';

export class GetUsersQuery extends PaginationDto {
    @ApiPropertyOptional({
        name: 'userId',
        required: false,
        default: null,
    })
    userId: number;

    @ApiPropertyOptional({
        name: 'userName',
        required: false,
    })
    userName: string;

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
        name: 'fullNameContains',
        required: false,
    })
    fullNameContains: string;

    @ApiPropertyOptional({
        name: 'lastNameStartsWith',
        required: false,
        maxLength: 1,
    })
    lastNameStartsWith: string;

    @ApiPropertyOptional({
        name: 'includeAdministratorRoles',
        type: Boolean,
        required: false,
    })
    @ToBoolean()
    includeAdministratorRoles: boolean;

    @ApiPropertyOptional({
        name: 'includeDistrictCoordinatorRoles',
        required: false,
    })
    @ToBoolean()
    includeDistrictCoordinatorRoles: boolean;

    @ApiPropertyOptional({
        name: 'includeMaintenanceCoordinatorRoles',
        type: Boolean,
        required: false,
    })
    @ToBoolean()
    includeMaintenanceCoordinatorRoles: boolean;

    @ApiPropertyOptional({
        name: 'includeApproverRoles',
        type: Boolean,
        required: false,
    })
    @ToBoolean()
    includeApproverRoles: boolean;

    @ApiPropertyOptional({
        name: 'includeSupportCoordinatorRoles',
        type: Boolean,
        required: false,
    })
    @ToBoolean()
    includeSupportCoordinatorRoles: boolean;

    @ApiPropertyOptional({
        name: 'includeActiveUsers',
        type: Boolean,
        required: false,
        default: true,
    })
    @ToBoolean()
    includeActiveUsers: boolean;

    @ApiPropertyOptional({
        name: 'includeInactiveUsers',
        type: Boolean,
        required: false,
    })
    @ToBoolean()
    includeInactiveUsers: boolean;

    currentUser: User;
}
