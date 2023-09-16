import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Segment } from 'src/entities';
import { GetSegmentNameDto } from 'src/segments/dto';
import { SegmentsService } from 'src/segments/segments.service';
import { GetAvailableSegmentByIdQuery } from '../impl';

/**
 * Query handler for the GetAvailableSegmentByIdQuery message
 */
@QueryHandler(GetAvailableSegmentByIdQuery)
export class GetAvailableSegmentByIdHandler
    implements IQueryHandler<GetAvailableSegmentByIdQuery>
{
    constructor(
        private readonly service: SegmentsService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     *
     * @param query
     * @returns Returns the a single available segment matching the segmentId
     */
    async execute(
        query: GetAvailableSegmentByIdQuery,
    ): Promise<GetSegmentNameDto> {
        const segment = await this.service.findAvailableSegmentById(
            query.segmentId,
            query.currentUser,
        );
        return this.mapper.map(segment, GetSegmentNameDto, Segment);
    }
}
