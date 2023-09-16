import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { Config } from 'src/common';
import { SendMailCommand, MailTemplate } from 'src/mail/command/impl';
import { Repository, getConnection } from 'typeorm';

export abstract class DeleteApplicationCommandHandlerBase {
    constructor(
        protected readonly configService: ConfigService,
        protected readonly queryBus: QueryBus,
        protected readonly commandBus: CommandBus,
        @InjectRepository(Application)
        protected readonly appRepository: Repository<Application>,
    ) {}

    /**
     * Inform the primary contact that the application was deleted
     * @param email
     */
    async sendVolunteerConfirmationEmail(email: string): Promise<void> {
        try {
            // exit early if we have no email
            if (!email || email.trim() === '') {
                return;
            }

            const sendEmailMessage = new SendMailCommand(
                [email],
                this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
                'Adopt a Highway application has been deleted',
                MailTemplate.ApplicationDeleted,
                null,
                null,
            );
            await this.commandBus.execute(sendEmailMessage);
        } catch (err) {
            Logger.warn(
                err.message,
                'DeleteApplicationCommandHandler::sendVolunteerConfirmationEmail',
            );
        }
    }

    /**
     * Retrieves the volunteers email. Does not throw an error so we can delete the app regardless
     * @param applicationId
     * @returns
     */
    async getVolunteerEmail(applicationId: number) {
        try {
            const app: Application = await this.appRepository
                .createQueryBuilder('app')
                .where(`APPLICATION_ID = :applicationId`, {
                    applicationId,
                })
                .getOne();

            return app.primaryContactEmail;
        } catch (err) {
            // log message but we do not care if the email doesn't go out.
            Logger.warn(
                err.message,
                'DeleteApplicationCommandHandler::getVolunteerEmail',
            );
        }
    }

    /**
     * Deletes the application using the tokens
     * @param applicationToken
     * @param accessToken
     */
    async deleteApplication(applicationId: number) {
        if (!applicationId || isNaN(applicationId)) {
            throw new InternalServerErrorException(
                'argumentId was not a number',
            );
        }

        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            await queryRunner.manager
                .getRepository(Application)
                .createQueryBuilder('a')
                .delete()
                .where('APPLICATION_ID = :applicationId', {
                    applicationId,
                })
                .execute();

            await queryRunner.commitTransaction();
            Logger.debug(`Deleted application id: ${applicationId}`);
        } catch (err) {
            await queryRunner.rollbackTransaction();
            Logger.error(
                `Could not delete the application (applicationId): ${applicationId}\n
                Rolling back database changes:\n${err.message}`,
                'DeleteApplicationCommandHandler',
            );
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
