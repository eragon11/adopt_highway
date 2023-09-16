import { Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { Application } from 'src/applications/entities/application.entity';
import { GetApplicationByTokensQuery } from 'src/applications/queries/impl';
import { ApplicationStatus, Config } from 'src/common/enum';
import { CANNOT_SAVE_APPLICATION } from 'src/constants/common.constants';
import { SendMailCommand, MailTemplate } from 'src/mail/command/impl';
import { ConvertObjectToPartialEntity } from 'src/utils/typeorm.utils';
import { getConnection, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateApplicationByTokensCommand } from '../impl';

/**
 * Handles the {UpdateApplicationByTokensCommand} message
 */
@CommandHandler(UpdateApplicationByTokensCommand)
export class UpdateApplicationByTokensCommandHandler
    implements ICommandHandler<UpdateApplicationByTokensCommand>
{
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly configService: ConfigService,
    ) {}

    private readonly logger = new Logger(
        UpdateApplicationByTokensCommandHandler.name,
    );

    private async updateApplication(
        command: UpdateApplicationByTokensCommand,
    ): Promise<any> {
        // retain the token values,then remove them from command
        const applicationToken = command.applicationToken;
        const accessToken = command.accessToken;

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            delete command['applicationToken'];
            delete command['accessToken'];

            // Update needs a partial of our application
            const application: QueryDeepPartialEntity<Application> =
                ConvertObjectToPartialEntity<Application>(command);

            // add current date to the MODIFIED_ON field
            application.modifiedOn = new Date();

            const result: UpdateResult = await queryRunner.manager
                .createQueryBuilder()
                .update(Application)
                .set(application)
                .where(
                    `APPLICATION_TOKEN = :applicationToken AND 
                    ACCESS_TOKEN = :accessToken AND 
                    STATUS = :status AND 
                    EXPIRES_ON > GETDATE()`,
                    {
                        applicationToken,
                        accessToken,
                        status: ApplicationStatus.NotConfirmed,
                    },
                )
                .execute();

            // throw unauthorized if zero records were updated - this will be thrown if the application has a state other than 'Not confirmed"
            if (result.affected === 0) {
                throw new UnauthorizedException(CANNOT_SAVE_APPLICATION);
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                `Rolling back database changes:\n${err.message}`,
                'UpdateApplicationByTokensCommandHandler',
            );
            throw err;
        } finally {
            await queryRunner.release();
        }
        return { applicationToken, accessToken };
    }

    private async getApplication(
        applicationToken: string,
        accessToken: string,
    ): Promise<Application> {
        // inform the user
        return this.queryBus.execute(
            new GetApplicationByTokensQuery(applicationToken, accessToken),
        );
    }

    /**
     * Sends an email to the primary contact
     * @param email volunteer recipient
     * @param applicationToken
     * @param accessToken
     */
    private async sendVolunteerEmail(
        email: string,
        applicationToken: string,
        accessToken: string,
    ): Promise<void> {
        const sendEmailMessage = new SendMailCommand(
            [email],
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            'Your application for Adopt a Highway has been updated',
            MailTemplate.ApplicationUpdated,
            undefined,
            {
                path: `${this.configService.get(
                    Config.VIEW_ANONYMOUS_APP_URL,
                )}/${applicationToken}/${accessToken}`,
            },
        );
        await this.commandBus.execute(sendEmailMessage);
    }

    /**
     *
     * @param {UpdateApplicationByTokensCommand} command
     * @returns
     */
    async execute(command: UpdateApplicationByTokensCommand): Promise<void> {
        this.logger.log(
            `Updating an application by tokens ${JSON.stringify(command)}`,
        );

        const applicationToken = command.applicationToken;
        const accessToken = command.accessToken;

        await this.updateApplication(command)
            .then((command) =>
                this.getApplication(
                    command.applicationToken,
                    command.accessToken,
                ),
            )
            .then((app: Application) =>
                this.sendVolunteerEmail(
                    app.primaryContactEmail,
                    applicationToken,
                    accessToken,
                ),
            )
            .catch((error) => {
                throw error;
            });
    }
}
