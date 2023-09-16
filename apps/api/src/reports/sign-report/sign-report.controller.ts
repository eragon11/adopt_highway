import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Roles } from 'src/common/enum';
import { STATEWIDE_ROLES } from 'src/constants/common.constants';
import SignReportDto from 'src/dto/signReport.dto';
import {
    AdminSignReportQueryDto,
    DistrictSignReportQueryDto,
    OfficeSignReportQueryDto,
} from './sign-report.api.utils';
import { SignReportService } from './sign-report.service';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';

@UseGuards(JwtAuthenticationGuard)
@Controller('report/sign')
export class SignReportController {
    constructor(private readonly service: SignReportService) {}

    @UseGuards(RoleGuard([...STATEWIDE_ROLES]))
    @Get('admin')
    async admin(
        @RequestUserWithCurrentRole() request: RequestWithUser,
        @Query() options: AdminSignReportQueryDto,
    ): Promise<Pagination<SignReportDto>> {
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
        @Query() options: DistrictSignReportQueryDto,
    ): Promise<Pagination<SignReportDto>> {
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
        @Query() options: OfficeSignReportQueryDto,
    ): Promise<Pagination<SignReportDto>> {
        return await this.service.findAllForMaintenanceOffice({
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
