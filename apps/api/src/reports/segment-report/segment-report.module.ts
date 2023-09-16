import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Segment } from 'src/entities/segment.entity';
import { SegmentReportMapperProfile } from './segment-report.mapper.profile';
import { SegmentReportService } from './segment-report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Segment])],
    providers: [SegmentReportService, SegmentReportMapperProfile],
    exports: [SegmentReportService],
})
export class SegmentReportModule {}
