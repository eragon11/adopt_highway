import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import { STATEWIDE_ROLES } from 'src/constants/common.constants';
import { SegmentReportDto } from 'src/dto/segmentReport.dto';
import RoleGuard from '../../auth/guards/role.guard';
import JwtAuthenticationGuard from '../../auth/guards/jwt-auth.guard';
import RequestWithUser from '../../auth/interfaces/requestWithUser.interface';
import { Roles } from '../../common/enum';
import { ReportOptions } from '../utils/report.utils';
import {
    AdminReportQueryDto,
    DistrictReportQueryDto,
    OfficeReportQueryDto,
} from './segment-report.api.utils';
import { SegmentReportService } from './segment-report.service';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';

@UseGuards(JwtAuthenticationGuard)
@Controller('report/segment')
export class SegmentReportController {
    constructor(private readonly service: SegmentReportService) {}

    @UseGuards(RoleGuard([...STATEWIDE_ROLES]))
    @Get('admin')
    async admin(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: AdminReportQueryDto,
    ): Promise<Pagination<SegmentReportDto>> {
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

        return this.service.findAllForAdmin(reportOptions);
    }

    @UseGuards(RoleGuard([Roles.DistrictCoordinator]))
    @Get('district')
    async district(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: DistrictReportQueryDto,
    ): Promise<Pagination<SegmentReportDto>> {
        const reportOptions: ReportOptions = {
            user: request.user,
            districtNumber: null,
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
        return this.service.findAllForDistrict(reportOptions);
    }

    @UseGuards(RoleGuard([Roles.MaintenanceCoordinator]))
    @Get('maintenance-section')
    async maintenanceSection(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query()
        options: OfficeReportQueryDto,
    ): Promise<Pagination<SegmentReportDto>> {
        const reportOptions: ReportOptions = {
            user: request.user,
            districtNumber: null,
            officeNumber: null,
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
        return this.service.findAllForMaintenanceOffice(reportOptions);
    }
}
