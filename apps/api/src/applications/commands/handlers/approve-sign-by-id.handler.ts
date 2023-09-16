import { InjectMapper } from '@automapper/nestjs';
import {
    InternalServerErrorException,
    Logger,
    UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { ApplicationsService } from 'src/applications/applications.service';
import { AnonymousApplicationDto } from 'src/applications/dto';
import { Application } from 'src/applications/entities';
import { ApplicationStatus, Config } from 'src/common';
import { DistrictsService } from 'src/districts/districts.service';
import { User } from 'src/entities';
import { SendMailCommand, MailTemplate } from 'src/mail/command/impl';
import { GetDistrictCoordinatorsForSegmentQuery } from 'src/users/queries/impl/get-district-coordinator-for-segment';
import { getConnection } from 'typeorm';
import { ApproveSignByIdCommand } from './../impl/approve-sign.command';
import { ApplicationHandlerBase } from './application-handler-base';

@CommandHandler(ApproveSignByIdCommand)
export class ApproveSignByIdCommandHandler
    extends ApplicationHandlerBase
    implements ICommandHandler<ApproveSignByIdCommand>
{
    /**
     *
     */
    constructor(
        protected readonly configService: ConfigService,
        protected readonly districtService: DistrictsService,
        protected readonly commandBus: CommandBus,
        protected readonly queryBus: QueryBus,
        protected readonly applicationService: ApplicationsService,
        @InjectMapper() private readonly mapper,
    ) {
        super(
            configService,
            districtService,
            commandBus,
            queryBus,
            applicationService,
        );
    }

    /**
     * Returns an array of emails for the district coordinators for this application.
     * Uses the segment to determine which district.
     * @param {Application} application application being approved
     * @param {User} currentUser current user making the request
     * @returns string array of District Coordinator emails for this application
     */
    private async getDcEmailsFromSegment(
        application: Application,
        currentUser: User,
    ): Promise<string[]> {
        const dcs: User[] = await this.queryBus.execute(
            new GetDistrictCoordinatorsForSegmentQuery(
                application.aahSegmentId.toString(),
                currentUser,
            ),
        );

        return dcs
            .map((c) => c?.emails[0]?.value)
            .filter((value) => (value ?? '').trim().includes('@'));
    }

    /**
     * Sends an email to the District Coordinators for this Application
     * @param {Application} application application being approved
     * @param {User} currentUser current user making the request
     */
    private async sendDcEmail(
        applicationId: number,
        application: Application,
        currentUser: User,
    ): Promise<void> {
        const dcEmails: string[] = await this.getDcEmailsFromSegment(
            application,
            currentUser,
        );

        if (dcEmails.length == 0) {
            const err = `There are no district coordinators configured for district on application ID: ${application.id}`;
            Logger.error(err);
            throw new InternalServerErrorException(null, err);
        }

        const sendEmailMessage = new SendMailCommand(
            dcEmails,
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            `${application.groupName} sign has been approved`,
            MailTemplate.SignApprovedToDc,
            null,
            {
                signText1: (application.signLine_1 ?? '').trim() ?? '',
                signText2: (application.signLine_2 ?? '').trim() ?? '',
                signText3: (application.signLine_3 ?? '').trim() ?? '',
                signText4: (application.signLine_4 ?? '').trim() ?? '',
                groupName: application.groupName,
                filepath: `${this.configService.get(
                    Config.VIEW_ANONYMOUS_APP_URL,
                )}/${applicationId}`,
            },
        );

        await this.commandBus.execute(sendEmailMessage);
    }

    private async updateApplication(
        application: Application,
        command: ApproveSignByIdCommand,
    ) {
        if (application.status !== ApplicationStatus.AwaitingSignApproval) {
            throw new UnprocessableEntityException(
                `Cannot approve sign with application status of ${application.status}`,
            );
        }

        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();
        await queryRunner.manager
            .getRepository(Application)
            .createQueryBuilder('a')
            .update(Application)
            .set({
                status: () =>
                    `'${ApplicationStatus.FinalReviewCreateAgreement.toString()}'`,
                modifiedOn: () => `GETDATE()`,
            })
            .where(`APPLICATION_ID = :applicationId`, {
                applicationId: command.applicationId,
            })
            .execute();
    }

    async execute(command: ApproveSignByIdCommand): Promise<void> {
        Logger.debug(`Approve the sign ${JSON.stringify(command)}`);

        const app = await this.getApplicationById(
            command.applicationId,
            command.currentUser,
        );

        const application = this.mapper.map(
            app,
            AnonymousApplicationDto,
            Application,
        );

        await this.updateApplication(application, command);
        await this.sendDcEmail(command.applicationId, app, command.currentUser);
    }
}
