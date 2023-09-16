import {
    Controller,
    Get,
    DefaultValuePipe,
    ParseIntPipe,
    Query,
    UseGuards,
    Param,
} from '@nestjs/common';
import { SegmentsService } from './segments.service';
import { Segment } from '../entities/segment.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import { CAN_VIEW_SEGMENTS } from 'src/common/permissions';
import { GetSegmentNameDto } from './dto';
import { QueryBus } from '@nestjs/cqrs';
import { GetAvailableSegmentByIdQuery } from './queries/impl';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

@UseGuards(JwtAuthenticationGuard)
@Controller('segments')
export class SegmentsController {
    constructor(
        private readonly segmentsService: SegmentsService,
        @InjectMapper() readonly mapper: Mapper,
        private readonly queryBus: QueryBus,
    ) {}

    @UseGuards(RoleGuard([...CAN_VIEW_SEGMENTS]))
    @Get()
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(50), ParseIntPipe)
        limit = 50,
    ): Promise<Pagination<Segment>> {
        limit = limit > 100 ? 100 : limit;
        // WIP: Attempting to determine where to convert to Dto - in the controller? Or in service '
        // before we send it to the controller?
        // const segmentDto = this.segmentsService.convertToDto(SegmentsEntity);
        return this.segmentsService.paginate({
            page: Number(page),
            limit: Number(limit),
            route: '/api/segments',
        });
    }

    /**
     * Retrieve the Segment entity matching the aahSegmentId value
     * @param aahSegmentId
     * @returns Segment that matches the aahSegmentId value
     */
    @UseGuards(RoleGuard([...CAN_VIEW_SEGMENTS]))
    @Get('available/:aahSegmentId')
    async getByAahSegmentId(
        @Param('aahSegmentId') aahSegmentId: string,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<GetSegmentNameDto> {
        const query = new GetAvailableSegmentByIdQuery(aahSegmentId, req.user);
        return this.queryBus.execute(query);
    }
}
