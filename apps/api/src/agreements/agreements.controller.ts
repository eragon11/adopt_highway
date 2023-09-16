import { GetActiveAgreementByIdForUserQuery } from './queries/impl/get-active-agreement-by-id.query';
import {
    Controller,
    DefaultValuePipe,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiQuery } from '@nestjs/swagger';
import { Pagination, PaginationTypeEnum } from 'nestjs-typeorm-paginate';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import {
    CAN_EDIT_AGREEMENTS,
    CAN_VIEW_AGREEMENTS,
} from 'src/common/permissions';
import { Agreement } from 'src/entities';
import { AgreementsService } from './agreements.service';
import { GetActiveAgreementsQuery } from './queries/impl/get-active-agreements-query';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import {
    ActiveAgreementDto,
    ActiveAgreementPickupsByIdQueryDto,
    RenewalAgreementDto,
    RewewalAgreementsQueryDto,
} from './dto';
import { CreateNewAgreementCommand } from './commands/impl';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
    GetPickupsByAgreementIdQuery,
    GetRenewalAgreementsQuery,
    GetSignedDocumentQuery,
} from '.';
import { AgreementPickupDto } from './dto/agreement.pickup.info.dto';

@UseGuards(JwtAuthenticationGuard)
@Controller('agreements')
export class AgreementsController {
    constructor(
        private readonly agreementsService: AgreementsService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @ApiQuery({
        name: 'page',
        type: Number,
        description: 'Current page number',
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        type: Number,
        description: 'Number of records per page',
        required: false,
    })
    @Get('')
    @UseGuards(RoleGuard([...CAN_VIEW_AGREEMENTS]))
    async index(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe)
        limit = 10,
    ): Promise<Pagination<Agreement>> {
        return this.agreementsService.paginate({
            page,
            limit,
            paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
        });
    }

    @Get('active')
    @UseGuards(RoleGuard([...CAN_VIEW_AGREEMENTS]))
    async getActiveAgreements(
        @Query() query: GetActiveAgreementsQuery,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<Pagination<Agreement>> {
        query.currentUser = req.user;
        return this.queryBus.execute(query);
    }

    @Get('active/:agreementId')
    @UseGuards(RoleGuard([...CAN_VIEW_AGREEMENTS]))
    async getActiveAgreementById(
        @Param('agreementId') agreementId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<ActiveAgreementDto> {
        const query = new GetActiveAgreementByIdForUserQuery(
            agreementId,
            req.user,
        );
        const agreement = await this.queryBus.execute(query);
        return this.mapper.map(agreement, ActiveAgreementDto, Agreement);
    }

    @Post('create-new-agreement/:applicationId')
    @UseGuards(RoleGuard([...CAN_EDIT_AGREEMENTS]))
    async createAgreement(
        @Query('applicationId', new ParseIntPipe()) applicationId: number,
        @RequestUserWithCurrentRole() { user }: RequestWithUser,
    ): Promise<ActiveAgreementDto> {
        const command = new CreateNewAgreementCommand(applicationId, user);
        const agreement = await this.commandBus.execute(command);
        return this.mapper.map(agreement, ActiveAgreementDto, Agreement);
    }

    @Get('signed-document/:agreementId')
    @UseGuards(RoleGuard([...CAN_EDIT_AGREEMENTS]))
    async getSignedDocument(
        @Param('agreementId', new ParseIntPipe()) agreementId: number,
        @RequestUserWithCurrentRole() { user }: RequestWithUser,
        @Res() res: Response,
    ): Promise<ActiveAgreementDto> {
        const query = new GetSignedDocumentQuery(agreementId, user, res);
        const document = await this.queryBus.execute(query);
        return document;
    }

    @Get('pickups')
    @UseGuards(RoleGuard([...CAN_VIEW_AGREEMENTS]))
    async getPickupInfoByAgreementIdForUser(
        @Query() dto: ActiveAgreementPickupsByIdQueryDto,
        @RequestUserWithCurrentRole() request: RequestWithUser,
    ): Promise<Pagination<AgreementPickupDto[]>> {
        const query = new GetPickupsByAgreementIdQuery(
            dto.id,
            request.user,
            dto.page,
            dto.orderBy,
            dto.orderByDirection,
        );
        const results = await this.queryBus.execute(query);
        return results;
    }

    @Get('renewal')
    @UseGuards(RoleGuard([...CAN_VIEW_AGREEMENTS]))
    async getRenewalAgreements(
        @Query() dto: RewewalAgreementsQueryDto,
        @RequestUserWithCurrentRole() request: RequestWithUser,
    ): Promise<Pagination<RenewalAgreementDto[]>> {
        const query = new GetRenewalAgreementsQuery(
            dto.districtNumber,
            dto.officeNumber,
            dto.countyNumber,
            dto.groupName,
            dto.renewalStatus,
            request.user,
            dto.page,
            dto.orderBy,
            dto.orderByDirection,
        );
        const results = await this.queryBus.execute(query);
        return results;
    }
}
