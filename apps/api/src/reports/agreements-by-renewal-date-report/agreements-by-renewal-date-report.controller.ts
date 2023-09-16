import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Roles } from 'src/common/enum';
import { AgreementsByRenewalDateReportDto } from 'src/dto/agreementsByRenewalDateReport.dto';
import { AgreementsByRenewalDateReportService } from './agreements-by-renewal-date-report.service';
import {
    AdminReportQueryDto,
    DistrictReportQueryDto,
    OfficeReportQueryDto,
} from './agreements-by-renewal-data-report.api.utils';
import { STATEWIDE_ROLES } from 'src/constants/common.constants';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';

@UseGuards(JwtAuthenticationGuard)
@Controller('report/agreements-by-renewal-date')
export class AgreementsByRenewalDateReportController {
    /**
     * constructs a AgreementsByRenewalDateReportController
     */
    constructor(
        private readonly service: AgreementsByRenewalDateReportService,
    ) {}

    @Get('admin')
    @UseGuards(RoleGuard([...STATEWIDE_ROLES]))
    async admin(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query()
        query: AdminReportQueryDto,
    ): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
        query.limit = query.limit > 100 ? 100 : query.limit;
        return this.service.findAllForAdmin({
            user: request.user,
            districtNumber: query.districtNumber,
            officeNumber: query.officeNumber,
            countyNumber: query.countyNumber,
            beginDate: query.beginDate,
            endDate: query.endDate,
            options: {
                orderByOptions: {
                    orderBy: query.orderBy,
                    orderByDirection: query.orderByDirection,
                },
                paginationOptions: {
                    page: query.page,
                    limit: query.limit,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            },
        });
    }

    @Get('district')
    @UseGuards(RoleGuard([Roles.DistrictCoordinator]))
    async district(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() query: DistrictReportQueryDto,
    ): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
        return this.service.findAllForDistrict({
            user: request.user,
            districtNumber: null,
            officeNumber: query.officeNumber,
            countyNumber: query.countyNumber,
            beginDate: query.beginDate,
            endDate: query.endDate,
            options: {
                orderByOptions: {
                    orderBy: query.orderBy,
                    orderByDirection: query.orderByDirection,
                },
                paginationOptions: {
                    page: query.page,
                    limit: query.limit,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            },
        });
    }

    @Get('maintenance-section')
    @UseGuards(RoleGuard([Roles.MaintenanceCoordinator]))
    async maintenanceSection(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() query: OfficeReportQueryDto,
    ): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
        return this.service.findAllForMaintenanceOffice({
            user: request.user,
            districtNumber: null,
            officeNumber: null,
            countyNumber: query.countyNumber,
            beginDate: query.beginDate,
            endDate: query.endDate,
            options: {
                orderByOptions: {
                    orderBy: query.orderBy,
                    orderByDirection: query.orderByDirection,
                },
                paginationOptions: {
                    page: query.page,
                    limit: query.limit,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            },
        });
    }
}
