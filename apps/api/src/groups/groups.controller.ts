import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { RoleGuard } from 'src/auth';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { CAN_VIEW_GROUPS } from 'src/common';
import { GetGroupNamesDto } from './dtos';
import { GetGroupNamesQuery } from './queries';

@UseGuards(JwtAuthenticationGuard)
@Controller('groups')
export class GroupsController {
    constructor(private readonly queryBus: QueryBus) {}

    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard([...CAN_VIEW_GROUPS]))
    @Get()
    async getGroupNames(@Query() dto: GetGroupNamesDto): Promise<string[]> {
        return this.queryBus.execute(new GetGroupNamesQuery(dto.groupName));
    }
}
