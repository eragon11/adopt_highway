import { Logger, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { ApplicationsService } from 'src/applications/applications.service';
import { Application } from 'src/applications/entities';
import { ApplicationStatus, Config } from 'src/common';
import { DistrictsService } from 'src/districts/districts.service';
import { getConnection } from 'typeorm';
import {
    MailTemplate,
    SendMailCommand,
} from './../../../mail/command/impl/send-mail.command';
import { RequestSignApprovalByIdCommand } from './../impl/request-sign-approval-by-id.command';
import { ApplicationHandlerBase } from './application-handler-base';

/**
 * Handler for updating application status to show we are requesting sign name approval
 */
@CommandHandler(RequestSignApprovalByIdCommand)
export class RequestSignApprovalByIdCommandHandler
    extends ApplicationHandlerBase
    implements ICommandHandler<RequestSignApprovalByIdCommand>
{
    constructor(
        protected readonly configService: ConfigService,
        protected readonly districtService: DistrictsService,
        protected readonly commandBus: CommandBus,
        protected readonly queryBus: QueryBus,
        protected readonly applicationService: ApplicationsService,
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
     * Send an email to the admin
     * @param {RequestSignApprovalByIdCommand} command
     * @param {Application} application
     */
    private async sendEmail(
        command: RequestSignApprovalByIdCommand,
        application: Application,
    ) {
        const email = this.configService.get(Config.AAH_ADMIN_EMAIL);
        const sendEmailMessage = new SendMailCommand(
            [email],
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            `${command.currentUser.fullName} has requested a sign name approval`,
            MailTemplate.RequestSignApproval,
            undefined,
            {
                filepath: `${this.configService.get(Config.CONFIRM_APP_URL)}/${
                    command.applicationId
                }`,
                currentUserName: command.currentUser.fullName,
                groupName: application.groupName,
                signRequestDescription:
                    command.signRequestDescription ??
                    '(No additional comments)',
            },
        );
        await this.commandBus.execute(sendEmailMessage);
    }

    /**
     * Updates the application status to Awaiting Sign Approval
     * @param {RequestSignApprovalByIdCommand} command
     * @returns
     */
    private async updateStatus(
        command: RequestSignApprovalByIdCommand,
    ): Promise<void> {
        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();
        await queryRunner.manager
            .getRepository(Application)
            .createQueryBuilder('a')
            .update(Application)
            .set({
                status: () =>
                    `'${ApplicationStatus.AwaitingSignApproval.toString()}'`,
                txdotContactUserId: () => `'${command.currentUser.id}'`,
                txdotContactFullName: () =>
                    `'${command.currentUser.firstName} ${command.currentUser.lastName}'`,
                txdotContactEmail: () =>
                    `'${command.currentUser.emails[0].value}'`,
                modifiedOn: () => `GETDATE()`,
            })
            .where(`APPLICATION_ID = :applicationId`, {
                applicationId: command.applicationId,
            })
            .execute();

        return;
    }

    /**
     * Updates the status and then sends out the email to the Admin
     * @param {RequestSignApprovalByIdCommand} command
     * @returns {void} nothing
     */
    async execute(command: RequestSignApprovalByIdCommand): Promise<void> {
        try {
            Logger.debug(`Request sign approval ${JSON.stringify(command)}`);

            const application = await this.getApplicationById(
                command.applicationId,
                command.currentUser,
            );

            if (application.status !== ApplicationStatus.RequestSignApproval) {
                throw new UnprocessableEntityException(
                    `Application status must be: '${ApplicationStatus.RequestSignApproval}'`,
                );
            }

            await this.updateStatus(command);
            await this.sendEmail(command, application);

            return;
        } catch (err) {
            Logger.error(
                err.message,
                RequestSignApprovalByIdCommandHandler.name,
            );
            throw err;
        }
    }
}
