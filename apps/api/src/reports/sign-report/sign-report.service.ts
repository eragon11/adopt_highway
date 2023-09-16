import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ReportOptions } from '../utils/report.utils';
import SignReportDto from 'src/dto/signReport.dto';
import {
    GetAllActiveSignStatus,
    PaginateAndOrderSignStatusReportDto,
} from './sign-report.query';
import { Sign } from 'src/entities/sign.entity';

@Injectable()
export class SignReportService {
    constructor(
        @InjectRepository(Sign) private repo: Repository<Sign>,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    async findAllForAdmin(
        reportOptions: ReportOptions,
    ): Promise<Pagination<SignReportDto>> {
        const signStatuses = GetAllActiveSignStatus(this.repo);
        if (reportOptions.districtNumber > 0) {
            signStatuses.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber: reportOptions.districtNumber,
            });
        }

        if (reportOptions.officeNumber > 0) {
            signStatuses.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: reportOptions.officeNumber,
            });
        }

        if (reportOptions.countyNumber > 0) {
            signStatuses.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: reportOptions.countyNumber,
            });
        }

        if (reportOptions.beginDate) {
            signStatuses.andWhere(
                'ss.BEGIN_DATE >= CAST(:beginDate as DATETIME2)',
                {
                    beginDate: reportOptions.beginDate,
                },
            );
        }

        if (reportOptions.endDate) {
            signStatuses.andWhere(
                'ss.BEGIN_DATE <= CAST(:endDate as DATETIME2)',
                {
                    endDate: reportOptions.endDate,
                },
            );
        }
        return PaginateAndOrderSignStatusReportDto(
            signStatuses,
            this.mapper,
            reportOptions.options,
        );
    }

    async findAllForDistrict(
        reportOptions: ReportOptions,
    ): Promise<Pagination<SignReportDto>> {
        const signStatuses = GetAllActiveSignStatus(this.repo);

        // filter for district
        const roles = reportOptions?.user?.currentRole;
        const districtNumber = roles.organization?.district?.number;

        if (districtNumber) {
            signStatuses.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber,
            });
        }

        if (reportOptions?.officeNumber > 0) {
            signStatuses.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: reportOptions?.officeNumber,
            });
        }

        if (reportOptions.countyNumber > 0) {
            signStatuses.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: reportOptions.countyNumber,
            });
        }

        if (reportOptions.beginDate) {
            signStatuses.andWhere(
                'ss.BEGIN_DATE >= CAST(:beginDate as DATETIME2)',
                {
                    beginDate: reportOptions.beginDate,
                },
            );
        }

        if (reportOptions.endDate) {
            signStatuses.andWhere(
                'ss.BEGIN_DATE <= CAST(:endDate as DATETIME2)',
                {
                    endDate: reportOptions.endDate,
                },
            );
        }

        return PaginateAndOrderSignStatusReportDto(
            signStatuses,
            this.mapper,
            reportOptions.options,
        );
    }

    async findAllForMaintenanceOffice(
        reportOptions: ReportOptions,
    ): Promise<Pagination<SignReportDto>> {
        const role = reportOptions?.user.currentRole;
        const districtNumber =
            role.organization?.maintenanceSection?.district?.number;
        const officeNumber = role.organization?.maintenanceSection?.number;

        const signStatuses = GetAllActiveSignStatus(this.repo).andWhere(
            'ms.NUMBER = :officeNumber AND ms.DISTRICT_NUMBER = :districtNumber',
            {
                officeNumber,
                districtNumber,
            },
        );

        if (reportOptions.countyNumber > 0) {
            signStatuses.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: reportOptions.countyNumber,
            });
        }

        if (reportOptions.beginDate) {
            signStatuses.andWhere(
                'ss.BEGIN_DATE >= CAST(:beginDate as DATETIME2)',
                {
                    beginDate: reportOptions.beginDate,
                },
            );
        }

        if (reportOptions.endDate) {
            signStatuses.andWhere(
                'ss.BEGIN_DATE <= CAST(:endDate as DATETIME2)',
                {
                    endDate: reportOptions.endDate,
                },
            );
        }

        return PaginateAndOrderSignStatusReportDto(
            signStatuses,
            this.mapper,
            reportOptions.options,
        );
    }
}
