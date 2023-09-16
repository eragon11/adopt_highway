import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AgreementsByRenewalDateReportDto } from 'src/dto/agreementsByRenewalDateReport.dto';
import { Agreement } from 'src/entities/agreement.entity';
import { Repository } from 'typeorm';
import {
    GetDistrictFromOptions,
    GetMaintenanceOfficeFromOptions,
    ReportOptions,
} from '../utils/report.utils';
import {
    GetAllActiveAgreementsByNewRenewalDate,
    PaginateAndOrderAgreementsByRenewalDateReportDto,
} from './agreements-by-renewal-date-report.query';

@Injectable()
export class AgreementsByRenewalDateReportService {
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(Agreement)
        private readonly repo: Repository<Agreement>,
    ) {}

    async findAllForAdmin(
        agreementReportOptions: ReportOptions,
    ): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
        const agreements = GetAllActiveAgreementsByNewRenewalDate(this.repo);
        if (agreementReportOptions.districtNumber > 0) {
            agreements.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber: agreementReportOptions.districtNumber,
            });
        }

        if (agreementReportOptions.officeNumber > 0) {
            agreements.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: agreementReportOptions.officeNumber,
            });
        }

        if (agreementReportOptions.countyNumber > 0) {
            agreements.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: agreementReportOptions.countyNumber,
            });
        }

        if (agreementReportOptions.beginDate) {
            agreements.andWhere(
                'a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)',
                {
                    beginDate: agreementReportOptions.beginDate,
                },
            );
        }

        if (agreementReportOptions.endDate) {
            agreements.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: agreementReportOptions.endDate,
            });
        }

        return PaginateAndOrderAgreementsByRenewalDateReportDto(
            agreements,
            this.mapper,
            agreementReportOptions.options,
        );
    }

    /**
     * Returns report data for a district coordinator
     * @param options report parameters
     * @returns report data for a district coordinator role
     */
    async findAllForDistrict(
        options: ReportOptions,
    ): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
        const district = GetDistrictFromOptions(options);
        options.districtNumber = district.number;
        return this.findAllForAdmin(options);
    }

    /**
     * Returns report data for a maintenance coordinator
     * @param options report parameters
     * @returns report data for a maintenance coordinator role
     */
    async findAllForMaintenanceOffice(
        options: ReportOptions,
    ): Promise<Pagination<AgreementsByRenewalDateReportDto>> {
        const office = GetMaintenanceOfficeFromOptions(options);
        options.officeNumber = office.number;
        options.districtNumber = office.district.number;
        return this.findAllForAdmin(options);
    }
}
