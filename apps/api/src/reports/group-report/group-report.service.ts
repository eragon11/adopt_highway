import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { Agreement } from 'src/entities/agreement.entity';
import { Repository } from 'typeorm';
import { GroupReportDto } from '../../dto/groupReport.dto';
import { ReportOptions } from '../utils/report.utils';
import {
    GetAllAgreements,
    PaginateAndOrderGroupReportDto,
} from './group-report.query';

@Injectable()
export class GroupReportService {
    constructor(
        @InjectRepository(Agreement) private repo: Repository<Agreement>,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    async GetAllForAdmin(
        reportOptions: ReportOptions,
    ): Promise<Pagination<GroupReportDto, IPaginationMeta>> {
        const records = GetAllAgreements(this.repo, reportOptions);
        if (reportOptions.districtNumber > 0) {
            records.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber: reportOptions.districtNumber,
            });
        }

        if (reportOptions.officeNumber > 0) {
            records.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: reportOptions.officeNumber,
            });
        }

        if (reportOptions.countyNumber > 0) {
            records.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: reportOptions.countyNumber,
            });
        }

        if (reportOptions.beginDate) {
            records.andWhere('gs.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: reportOptions.beginDate,
            });
        }

        if (reportOptions.endDate) {
            records.andWhere('gs.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: reportOptions.endDate,
            });
        }

        return PaginateAndOrderGroupReportDto(
            records,
            this.mapper,
            reportOptions.options,
        );
    }

    async GetAllForOffice(
        reportOptions: ReportOptions,
    ): Promise<Pagination<GroupReportDto, IPaginationMeta>> {
        const currentRole = reportOptions?.user.currentRole;
        const districtNumber =
            currentRole.organization?.maintenanceSection?.district?.number;

        const officeNumber =
            currentRole.organization?.maintenanceSection?.number;

        const records = GetAllAgreements(this.repo, reportOptions).andWhere(
            'ms.NUMBER = :officeNumber AND ms.DISTRICT_NUMBER = :districtNumber',
            {
                officeNumber,
                districtNumber,
            },
        );

        if (reportOptions.countyNumber > 0) {
            records.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: reportOptions.countyNumber,
            });
        }

        if (reportOptions.beginDate) {
            records.andWhere('gs.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: reportOptions.beginDate,
            });
        }

        if (reportOptions.endDate) {
            records.andWhere('gs.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                beginDate: reportOptions.endDate,
            });
        }

        return PaginateAndOrderGroupReportDto(
            records,
            this.mapper,
            reportOptions.options,
        );
    }

    async GetAllForDistrict(
        reportOptions: ReportOptions,
    ): Promise<Pagination<GroupReportDto, IPaginationMeta>> {
        const records = GetAllAgreements(this.repo, reportOptions);
        // filter for district
        const roles = reportOptions?.user?.currentRole;
        const districtNumber = roles.organization?.district?.number;

        if (districtNumber) {
            records.andWhere(`d.NUMBER = :number`, {
                number: districtNumber,
            });
        }

        if (reportOptions?.officeNumber > 0) {
            records.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: reportOptions?.officeNumber,
            });
        }

        if (reportOptions.countyNumber > 0) {
            records.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: reportOptions.countyNumber,
            });
        }

        if (reportOptions.beginDate) {
            records.andWhere('gs.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: reportOptions.beginDate,
            });
        }

        if (reportOptions.endDate) {
            records.andWhere('gs.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                beginDate: reportOptions.endDate,
            });
        }

        return PaginateAndOrderGroupReportDto(
            records,
            this.mapper,
            reportOptions.options,
        );
    }
}
