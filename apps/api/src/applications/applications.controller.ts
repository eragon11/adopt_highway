import { RequestSignApprovalByIdDto } from './dto/request-sign-approval-by-id.dto';
import { ApproveSignByIdCommand } from './commands/impl/approve-sign.command';
import { InjectMapper } from '@automapper/nestjs';
import {
    Query,
    UseGuards,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Body,
    Patch,
    Param,
    Get,
    Delete,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import {
    CAN_APPROVE_SIGN_APPLICATIONS,
    CAN_DELETE_APPLICATIONS,
    CAN_REJECT_SIGN_APPLICATIONS,
    CAN_REQUEST_SIGN_APPROVALS,
    CAN_SEND_TO_DOCUSIGN as CAN_CREATE_DOCUSIGN_DOCUMENT,
    CAN_UPDATE_APPLICATIONS,
    CAN_VIEW_APPLICATIONS,
} from 'src/common/permissions';
import { AllowAnonymous } from 'src/decorators';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import {
    CreateApplicationCommand,
    UpdateApplicationByIdCommand,
    UpdateApplicationByTokensCommand,
    ConfirmApplicationByTokensCommand,
    ConfirmApplicationByIdCommand,
    DeleteApplicationByTokensCommand,
    DeleteApplicationByIdCommand,
    RequestSignApprovalByIdCommand,
    CreateDocuSignDocumentCommand,
    UpdateLatestDocuSignDocumentStatusesCommand,
} from './commands/impl';
import {
    ApplicationsDto,
    AnonymousApplicationDto,
    CreateApplicationDto,
    UpdateApplicationBaseDto,
    RejectSignDto,
    MulesoftCreateDocumentResponseDto,
    DocumentStatusDto,
    ApplicationTokenDto,
} from './dto';
import { GetApplicationsQuery } from './queries/impl/get-applications.query';
import {
    GetApplicationByTokensQuery,
    GetApplicationByIdForUserQuery,
    GetLatestMulesoftStatusesQuery,
} from './queries/impl';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { Application } from '.';
import { RejectSignByIdCommand } from './commands/impl/reject-sign.command';
import { ApiBody } from '@nestjs/swagger';

@UseGuards(JwtAuthenticationGuard)
@Controller('applications')
export class ApplicationsController {
    constructor(
        @InjectMapper() private readonly mapper,
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @AllowAnonymous()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    async create(@Body() createApplicationDto: CreateApplicationDto) {
        const command = this.mapper.map(
            createApplicationDto,
            CreateApplicationCommand,
            CreateApplicationDto,
        );
        return await this.commandBus.execute(command);
    }

    @UseGuards(RoleGuard([...CAN_REQUEST_SIGN_APPROVALS]))
    @HttpCode(HttpStatus.OK)
    @Patch('requestSignApproval/:applicationId')
    async requestSignApproval(
        @Param('applicationId') applicationId: number,
        @Body() dto: RequestSignApprovalByIdDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ) {
        const command = new RequestSignApprovalByIdCommand(
            applicationId,
            dto.signRequestDescription,
            req.user,
        );
        return await this.commandBus.execute(command);
    }

    @UseGuards(RoleGuard([...CAN_APPROVE_SIGN_APPLICATIONS]))
    @HttpCode(HttpStatus.OK)
    @Patch('approveSign/:applicationId')
    async approveSignById(
        @Param('applicationId') applicationId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ) {
        const command = new ApproveSignByIdCommand(applicationId, req.user);
        return await this.commandBus.execute(command);
    }

    @UseGuards(RoleGuard([...CAN_REJECT_SIGN_APPLICATIONS]))
    @HttpCode(HttpStatus.OK)
    @Patch('rejectSign/:applicationId')
    async rejectSignById(
        @Param('applicationId') applicationId: number,
        @Body() dto: RejectSignDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ) {
        const command = new RejectSignByIdCommand(
            applicationId,
            dto.signRejectionComments,
            req.user,
        );
        return await this.commandBus.execute(command);
    }

    @UseGuards(RoleGuard([...CAN_UPDATE_APPLICATIONS]))
    @HttpCode(HttpStatus.OK)
    @Patch('confirm/:applicationId')
    async confirmById(
        @Param('applicationId') applicationId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ) {
        const command = new ConfirmApplicationByIdCommand(
            applicationId,
            req.user,
        );
        return await this.commandBus.execute(command);
    }

    @AllowAnonymous()
    @HttpCode(HttpStatus.OK)
    @Patch('confirm/:applicationToken/:accessToken')
    async confirmByToken(
        @Param('applicationToken') applicationToken: string,
        @Param('accessToken') accessToken: string,
    ) {
        const command = new ConfirmApplicationByTokensCommand(
            applicationToken,
            accessToken,
        );
        return await this.commandBus.execute(command);
    }

    @HttpCode(HttpStatus.OK)
    @Patch(':applicationId')
    @UseGuards(JwtAuthenticationGuard)
    @UseGuards(RoleGuard(CAN_UPDATE_APPLICATIONS))
    async patchById(
        @Param('applicationId') applicationId: number,
        @Body() dto: UpdateApplicationBaseDto,
        @RequestUserWithCurrentRole() request,
    ) {
        const command: UpdateApplicationByIdCommand = this.mapper.map(
            dto,
            UpdateApplicationByIdCommand,
            UpdateApplicationBaseDto,
        );
        command.applicationId = applicationId;
        command.currentUser = request.user;
        return await this.commandBus.execute(command);
    }

    @AllowAnonymous()
    @HttpCode(HttpStatus.OK)
    @Patch(':applicationToken/:accessToken')
    async patchByToken(
        @Param('applicationToken') applicationToken: string,
        @Param('accessToken') accessToken: string,
        @Body() dto: UpdateApplicationBaseDto,
    ) {
        const command = this.mapper.map(
            dto,
            UpdateApplicationByTokensCommand,
            UpdateApplicationBaseDto,
        );
        command.applicationToken = applicationToken;
        command.accessToken = accessToken;
        return await this.commandBus.execute(command);
    }

    @AllowAnonymous()
    @HttpCode(HttpStatus.OK)
    @Get(':applicationToken/:accessToken')
    async getByTokens(
        @Param('applicationToken') applicationToken: string,
        @Param('accessToken') accessToken: string,
    ) {
        const query = new GetApplicationByTokensQuery(
            applicationToken,
            accessToken,
        );
        const application = await this.queryBus.execute(query);

        const dto = this.mapper.map(
            application,
            AnonymousApplicationDto,
            Application,
        );
        // do NOT return applicationId
        dto.id = null;
        return dto;
    }

    /**
     *
     * @returns a list of applications matching the application id
     */
    @HttpCode(HttpStatus.OK)
    @Get(':applicationId')
    @UseGuards(JwtAuthenticationGuard)
    @UseGuards(RoleGuard(CAN_VIEW_APPLICATIONS))
    async getById(
        @Param('applicationId') applicationId: number,
        @RequestUserWithCurrentRole() request,
    ) {
        const query = new GetApplicationByIdForUserQuery(
            applicationId,
            request.user,
        );

        const application = await this.queryBus.execute(query);
        const dto = this.mapper.map(
            application,
            AnonymousApplicationDto,
            Application,
        );
        return dto;
    }

    @UseGuards(RoleGuard([...CAN_DELETE_APPLICATIONS]))
    @HttpCode(HttpStatus.OK)
    @Delete(':applicationId')
    async deleteById(
        @Param('applicationId') applicationId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ) {
        const command = new DeleteApplicationByIdCommand(
            applicationId,
            req.user,
        );
        return await this.commandBus.execute(command);
    }

    @AllowAnonymous()
    @HttpCode(HttpStatus.OK)
    @Delete(':applicationToken/:accessToken')
    async deleteByToken(
        @Param('applicationToken') applicationToken: string,
        @Param('accessToken') accessToken: string,
    ) {
        const command = new DeleteApplicationByTokensCommand(
            applicationToken,
            accessToken,
        );
        return await this.commandBus.execute(command);
    }

    /**
     *
     * @returns a list of applications matching the query
     */
    @HttpCode(HttpStatus.OK)
    @Get()
    @UseGuards(RoleGuard(CAN_VIEW_APPLICATIONS))
    async findAll(
        @Query() getApplicationsQuery: GetApplicationsQuery,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<ApplicationsDto[]> {
        getApplicationsQuery.currentUser = req.user;

        return await this.queryBus.execute(getApplicationsQuery);
    }

    @HttpCode(HttpStatus.OK)
    @Post('create-signing-document/:applicationId')
    @UseGuards(RoleGuard(CAN_CREATE_DOCUSIGN_DOCUMENT))
    async createSigningDocument(
        @Param('applicationId') applicationId: number,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<MulesoftCreateDocumentResponseDto> {
        const command = new CreateDocuSignDocumentCommand(
            applicationId,
            req.user,
        );
        return (await this.commandBus.execute(
            command,
        )) as MulesoftCreateDocumentResponseDto;
    }

    @ApiBody({ type: [ApplicationTokenDto] })
    @HttpCode(HttpStatus.OK)
    @Post('get-latest-mulesoft-statuses')
    @UseGuards(RoleGuard(CAN_CREATE_DOCUSIGN_DOCUMENT))
    async getLatestMuleSoftStatuses(
        @Body() dto: ApplicationTokenDto[],
    ): Promise<DocumentStatusDto[]> {
        const command = new GetLatestMulesoftStatusesQuery(dto);
        return (await this.queryBus.execute(command)) as DocumentStatusDto[];
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('update-pending-documents')
    @UseGuards(RoleGuard(CAN_CREATE_DOCUSIGN_DOCUMENT))
    async updatePendingDocuments(): Promise<void> {
        const command = new UpdateLatestDocuSignDocumentStatusesCommand(
            'Manually updating latest',
        );
        return await this.commandBus.execute(command);
    }
}
