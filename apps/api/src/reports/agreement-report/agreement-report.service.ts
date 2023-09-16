import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { AgreementReportDto } from '../../dto/agreementReport.dto';
import { Agreement } from '../../entities/agreement.entity';
import { Repository } from 'typeorm';
import {
    GetAllActiveAgreements,
    PaginateAndOrderAgreementReportDto,
} from './agreement-report.query';
import { ReportOptions } from '../utils/report.utils';

@Injectable()
export class AgreementReportService {
    constructor(
        @InjectRepository(Agreement)
        private agreementRepo: Repository<Agreement>,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    async findAllForAdmin(
        agreementReportOptions: ReportOptions,
    ): Promise<Pagination<AgreementReportDto>> {
        const agreements = GetAllActiveAgreements(this.agreementRepo);
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

        return PaginateAndOrderAgreementReportDto(
            agreements,
            this.mapper,
            agreementReportOptions.options,
        );
    }

    async findAllForDistrict(
        agreementReportOptions: ReportOptions,
    ): Promise<Pagination<AgreementReportDto>> {
        const agreements = GetAllActiveAgreements(this.agreementRepo);

        // filter for district
        const currentRole = agreementReportOptions?.user?.currentRole;
        const districtNumber = currentRole.organization?.district?.number;

        if (districtNumber) {
            agreements.andWhere(`d.NUMBER = :number`, {
                number: districtNumber,
            });
        }

        if (agreementReportOptions?.officeNumber > 0) {
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

        return PaginateAndOrderAgreementReportDto(
            agreements,
            this.mapper,
            agreementReportOptions.options,
        );
    }

    async findAllForMaintenanceOffice(
        agreementReportOptions: ReportOptions,
    ): Promise<Pagination<AgreementReportDto>> {
        const currentRole = agreementReportOptions?.user.currentRole;
        const districtNumber =
            currentRole.organization?.maintenanceSection?.district?.number;

        const officeNumber =
            currentRole.organization?.maintenanceSection?.number;

        const agreements = GetAllActiveAgreements(this.agreementRepo);

        agreements.andWhere(
            `d.NUMBER = :districtNumber AND ms.NUMBER = :officeNumber`,
            {
                districtNumber,
                officeNumber,
            },
        );

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

        return PaginateAndOrderAgreementReportDto(
            agreements,
            this.mapper,
            agreementReportOptions.options,
        );
    }
}
