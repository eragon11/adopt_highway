import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import { SegmentReportDto } from 'src/dto/segmentReport.dto';
import { Segment } from 'src/entities/segment.entity';
import { Repository } from 'typeorm';
import { ReportOptions } from '../utils/report.utils';
import {
    GetAllSegments,
    GetPaginatedAndOrderedSegmentReportDto,
} from './segment-report.query';

@Injectable()
export class SegmentReportService {
    constructor(
        @InjectRepository(Segment) private segmentRepo: Repository<Segment>,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    async findAllForAdmin(
        segmentReportOptions: ReportOptions,
    ): Promise<Pagination<SegmentReportDto>> {
        const segments = GetAllSegments(this.segmentRepo);
        if (segmentReportOptions.districtNumber > 0) {
            segments.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber: segmentReportOptions.districtNumber,
            });
        }

        if (segmentReportOptions.officeNumber > 0) {
            segments.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: segmentReportOptions.officeNumber,
            });
        }

        if (segmentReportOptions.countyNumber > 0) {
            segments.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: segmentReportOptions.countyNumber,
            });
        }

        if (segmentReportOptions.beginDate) {
            segments.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: segmentReportOptions.beginDate,
            });
        }

        if (segmentReportOptions.endDate) {
            segments.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: segmentReportOptions.endDate,
            });
        }
        return GetPaginatedAndOrderedSegmentReportDto(
            segments,
            this.mapper,
            segmentReportOptions.options,
        );
    }

    async findAllForDistrict(
        segmentReportOptions: ReportOptions,
    ): Promise<Pagination<SegmentReportDto>> {
        const segments = GetAllSegments(this.segmentRepo);

        // filter for district
        const roles = segmentReportOptions?.user?.currentRole;
        const districtNumber = roles.organization?.district?.number;

        if (districtNumber) {
            segments.andWhere(`d.NUMBER = :districtNumber`, {
                districtNumber,
            });
        }

        if (segmentReportOptions?.officeNumber > 0) {
            segments.andWhere('ms.NUMBER = :officeNumber', {
                officeNumber: segmentReportOptions?.officeNumber,
            });
        }

        if (segmentReportOptions.countyNumber > 0) {
            segments.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: segmentReportOptions.countyNumber,
            });
        }

        if (segmentReportOptions.beginDate) {
            segments.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: segmentReportOptions.beginDate,
            });
        }

        if (segmentReportOptions.endDate) {
            segments.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: segmentReportOptions.endDate,
            });
        }

        return GetPaginatedAndOrderedSegmentReportDto(
            segments,
            this.mapper,
            segmentReportOptions.options,
        );
    }

    async findAllForMaintenanceOffice(
        segmentReportOptions: ReportOptions,
    ): Promise<Pagination<SegmentReportDto>> {
        const currentRole = segmentReportOptions?.user.currentRole;
        const districtNumber =
            currentRole.organization?.maintenanceSection?.district?.number;

        const officeNumber =
            currentRole.organization?.maintenanceSection?.number;

        const segments = GetAllSegments(this.segmentRepo).andWhere(
            'd.NUMBER = :districtNumber AND ms.NUMBER = :officeNumber',
            {
                districtNumber,
                officeNumber,
            },
        );

        if (segmentReportOptions.countyNumber > 0) {
            segments.andWhere('c.NUMBER = :countyNumber', {
                countyNumber: segmentReportOptions.countyNumber,
            });
        }

        if (segmentReportOptions.beginDate) {
            segments.andWhere('a.BEGIN_DATE >= CAST(:beginDate as DATETIME2)', {
                beginDate: segmentReportOptions.beginDate,
            });
        }

        if (segmentReportOptions.endDate) {
            segments.andWhere('a.BEGIN_DATE <= CAST(:endDate as DATETIME2)', {
                endDate: segmentReportOptions.endDate,
            });
        }
        return GetPaginatedAndOrderedSegmentReportDto(
            segments,
            this.mapper,
            segmentReportOptions.options,
        );
    }
}
