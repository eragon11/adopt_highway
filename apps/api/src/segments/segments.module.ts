import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Segment } from 'src/entities/segment.entity';
import { SegmentMapperProfile } from './mapper/segment.mapper.profile';
import { SegmentQueryHandlers } from './queries/handlers';
import { SegmentsService } from './segments.service';

@Module({
    imports: [TypeOrmModule.forFeature([Segment])],
    providers: [SegmentsService, SegmentMapperProfile, ...SegmentQueryHandlers],
    exports: [SegmentsService],
})
export class SegmentsModule {}
