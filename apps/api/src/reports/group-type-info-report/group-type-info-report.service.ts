import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { GroupTypeInfoReportDto } from 'src/dto/groupTypeInfoReport.dtos';
import { Connection } from 'typeorm';
import {
    GetDistrictFromOptions,
    GetMaintenanceOfficeFromOptions,
    ReportOptions,
} from '../utils/report.utils';
import { GetAllActiveGroupTypeInfos } from './group-type-info-report.query';

/**
 * Service for retrieving Group Type Info Repo data
 */
@Injectable()
export class GroupTypeInfoReportService {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    /**
     * returns filtered group type info report data
     * @param reportOptions
     * @returns filtered group type info report data
     */
    async findAllForAdmin(
        reportOptions: ReportOptions,
    ): Promise<Pagination<GroupTypeInfoReportDto>> {
        return GetAllActiveGroupTypeInfos(this.connection, reportOptions);
    }

    /**
     * Returns group type info report data for a district coordinator
     * @param options report parameters
     * @returns group type info report data for a district coorindator role
     */
    async findAllForDistrict(
        options: ReportOptions,
    ): Promise<Pagination<GroupTypeInfoReportDto>> {
        const district = GetDistrictFromOptions(options);
        options.districtNumber = district.number;
        return this.findAllForAdmin(options);
    }

    /**
     * Returns group type info report data for a maintenance section coordinator
     * @param options report parameters
     * @returns group type info report data for a maintenance section role
     */
    async findAllForMaintenanceOffice(
        options: ReportOptions,
    ): Promise<Pagination<GroupTypeInfoReportDto>> {
        const office = GetMaintenanceOfficeFromOptions(options);
        options.districtNumber = office.district.number;
        options.officeNumber = office.number;
        return this.findAllForAdmin(options);
    }
}
