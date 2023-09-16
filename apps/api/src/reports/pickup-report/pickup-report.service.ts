import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { PickupReportDto } from 'src/dto/pickupReport.dto';
import { Pickup } from 'src/entities/pickup.entity';
import { Repository } from 'typeorm';
import { ReportOptions } from '../utils/report.utils';
import {
    GetAllActivePickups,
    GetPaginatedAndOrderedPickupReportDto,
} from './pickup-report.query';

@Injectable()
export class PickupReportService {
    constructor(
        @InjectRepository(Pickup) private pickupRepo: Repository<Pickup>,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    async findAllForAdmin(
        pickupReportOptions: ReportOptions,
    ): Promise<Pagination<PickupReportDto>> {
        const pickups = GetAllActivePickups(this.pickupRepo);
        if (pickupReportOptions.districtNumber > 0) {
            pickups.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber: pickupReportOptions.districtNumber,
            });
        }

        if (pickupReportOptions.officeNumber > 0) {
            pickups.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: pickupReportOptions.officeNumber,
            });
        }

        if (pickupReportOptions.countyNumber > 0) {
            pickups.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: pickupReportOptions.countyNumber,
            });
        }

        if (pickupReportOptions.beginDate) {
            pickups.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: pickupReportOptions.beginDate,
            });
        }

        if (pickupReportOptions.endDate) {
            pickups.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: pickupReportOptions.endDate,
            });
        }

        return GetPaginatedAndOrderedPickupReportDto(
            pickups,
            this.mapper,
            pickupReportOptions.options,
        );
    }

    async findAllForDistrict(
        pickupReportOptions: ReportOptions,
    ): Promise<Pagination<PickupReportDto>> {
        const pickups = GetAllActivePickups(this.pickupRepo);

        // filter for district
        const roles = pickupReportOptions?.user?.currentRole;
        const districtNumber = roles.organization?.district?.number;

        if (districtNumber) {
            pickups.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber,
            });
        }

        if (pickupReportOptions?.officeNumber > 0) {
            pickups.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: pickupReportOptions?.officeNumber,
            });
        }

        if (pickupReportOptions.countyNumber > 0) {
            pickups.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: pickupReportOptions.countyNumber,
            });
        }

        if (pickupReportOptions.beginDate) {
            pickups.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: pickupReportOptions.beginDate,
            });
        }

        if (pickupReportOptions.endDate) {
            pickups.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: pickupReportOptions.endDate,
            });
        }

        return GetPaginatedAndOrderedPickupReportDto(
            pickups,
            this.mapper,
            pickupReportOptions.options,
        );
    }

    async findAllForMaintenanceOffice(
        pickupReportOptions: ReportOptions,
    ): Promise<Pagination<PickupReportDto>> {
        const currentRole = pickupReportOptions?.user.currentRole;
        const districtNumber =
            currentRole.organization?.maintenanceSection?.district?.number;

        const officeNumber =
            currentRole.organization?.maintenanceSection?.number;

        const pickups = GetAllActivePickups(this.pickupRepo).andWhere(
            'ms.NUMBER = :officeNumber AND ms.DISTRICT_NUMBER = :districtNumber',
            {
                officeNumber,
                districtNumber,
            },
        );

        if (pickupReportOptions.countyNumber > 0) {
            pickups.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: pickupReportOptions.countyNumber,
            });
        }

        if (pickupReportOptions.beginDate) {
            pickups.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: pickupReportOptions.beginDate,
            });
        }

        if (pickupReportOptions.endDate) {
            pickups.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: pickupReportOptions.endDate,
            });
        }

        return GetPaginatedAndOrderedPickupReportDto(
            pickups,
            this.mapper,
            pickupReportOptions.options,
        );
    }
}
