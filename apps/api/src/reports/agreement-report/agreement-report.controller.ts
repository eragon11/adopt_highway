import { UseGuards, Controller, Get, Query } from '@nestjs/common';
import { Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { STATEWIDE_ROLES } from 'src/constants/common.constants';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import { AgreementReportDto } from 'src/dto/agreementReport.dto';
import RoleGuard from '../../auth/guards/role.guard';
import { Roles } from '../../common/enum';
import {
    AdminReportQueryDto,
    DistrictReportQueryDto,
    OfficeReportQueryDto,
} from './agreement-report.api.utils';
import { AgreementReportService } from './agreement-report.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('report/agreement')
export class AgreementReportController {
    constructor(private readonly service: AgreementReportService) {}

    @UseGuards(RoleGuard([...STATEWIDE_ROLES]))
    @Get('admin')
    async admin(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: AdminReportQueryDto,
    ): Promise<Pagination<AgreementReportDto>> {
        return this.service.findAllForAdmin({
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
        });
    }

    @UseGuards(RoleGuard([Roles.DistrictCoordinator]))
    @Get('district')
    async district(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: DistrictReportQueryDto,
    ): Promise<Pagination<AgreementReportDto>> {
        return this.service.findAllForDistrict({
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
        });
    }

    @UseGuards(RoleGuard([Roles.MaintenanceCoordinator]))
    @Get('maintenance-section')
    async maintenanceSection(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: OfficeReportQueryDto,
    ): Promise<Pagination<AgreementReportDto>> {
        return this.service.findAllForMaintenanceOffice({
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
        });
    }
}
