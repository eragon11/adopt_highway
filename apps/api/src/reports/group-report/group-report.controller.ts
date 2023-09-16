import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
    IPaginationMeta,
    Pagination,
    PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';

import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Roles } from 'src/common/enum';
import { STATEWIDE_ROLES } from 'src/constants/common.constants';
import { GroupReportDto } from 'src/dto/groupReport.dto';
import {
    AdminReportQueryDto,
    DistrictReportQueryDto,
    OfficeReportQueryDto,
} from '../group-report/group-report.api.utils';
import { ReportOptions } from '../utils/report.utils';
import { GroupReportService } from './group-report.service';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';

@UseGuards(JwtAuthenticationGuard)
@Controller('report/group')
export class GroupReportController {
    constructor(private readonly service: GroupReportService) {}

    @UseGuards(RoleGuard([...STATEWIDE_ROLES]))
    @Get('/admin')
    async admin(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: AdminReportQueryDto,
    ): Promise<Pagination<GroupReportDto, IPaginationMeta>> {
        const reportOptions: ReportOptions = {
            user: request.user,
            districtNumber: options.districtNumber,
            officeNumber: options.officeNumber,
            countyNumber: options.countyNumber,
            beginDate: options.beginDate,
            endDate: options.endDate,
            options: {
                orderByOptions: {
                    orderBy: options.orderBy,
                    orderByDirection: options.orderByDirection,
                },
                paginationOptions: {
                    page: options.page,
                    limit: options.limit,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            },
        };

        return this.service.GetAllForAdmin(reportOptions);
    }

    @UseGuards(RoleGuard([Roles.DistrictCoordinator]))
    @Get('/district')
    async district(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: DistrictReportQueryDto,
    ): Promise<Pagination<GroupReportDto, IPaginationMeta>> {
        const reportOptions: ReportOptions = {
            user: request.user,
            districtNumber: options.districtNumber,
            officeNumber: options.officeNumber,
            countyNumber: options.countyNumber,
            beginDate: options.beginDate,
            endDate: options.endDate,
            options: {
                orderByOptions: {
                    orderBy: options.orderBy,
                    orderByDirection: options.orderByDirection,
                },
                paginationOptions: {
                    page: options.page,
                    limit: options.limit,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            },
        };

        return this.service.GetAllForDistrict(reportOptions);
    }

    @UseGuards(RoleGuard([Roles.MaintenanceCoordinator]))
    @Get('/maintenance-section')
    async maintenanceSection(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: OfficeReportQueryDto,
    ): Promise<Pagination<GroupReportDto, IPaginationMeta>> {
        const reportOptions: ReportOptions = {
            user: request.user,
            countyNumber: options.countyNumber,
            beginDate: options.beginDate,
            endDate: options.endDate,
            options: {
                orderByOptions: {
                    orderBy: options.orderBy,
                    orderByDirection: options.orderByDirection,
                },
                paginationOptions: {
                    page: options.page,
                    limit: options.limit,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            },
            districtNumber: null,
            officeNumber: null,
        };

        return this.service.GetAllForOffice(reportOptions);
    }
}
