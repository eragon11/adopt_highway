import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Guid } from 'guid-typescript';
import { Application } from 'src/applications/entities/application.entity';
import { ApplicationStatus, Config } from 'src/common/enum';
import { MailTemplate, SendMailCommand } from 'src/mail/command/impl';
import { getConnection } from 'typeorm';
import { CreateApplicationCommand } from '../impl';

@CommandHandler(CreateApplicationCommand)
export class CreateApplicationCommandHandler
    implements ICommandHandler<CreateApplicationCommand>
{
    constructor(
        private readonly configService: ConfigService,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly commandBus: CommandBus,
    ) {}

    /**
     * Converts a CreateApplicationCommand into an Application object
     * @param {CreateApplicationCommand} command
     * @returns {Application}
     */
    convertToApplications(command: CreateApplicationCommand) {
        const application = this.mapper.map(
            command,
            Application,
            CreateApplicationCommand,
        );
        // assign GUID tokens
        application.applicationToken = Guid.create().toString();
        application.accessToken = Guid.create().toString();

        // set created and expires on date
        const expiry =
            this.configService.get(Config.APPLICATION_AGE_WARNING) ?? 30;
        const now = new Date();

        application.createdOn = new Date();
        application.expiresOn = new Date(now.setDate(now.getDate() + expiry));

        return application;
    }

    async sendConfirmationEmail(
        email: string,
        applicationToken: string,
        accessToken: string,
    ): Promise<void> {
        const sendEmailMessage = new SendMailCommand(
            email,
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            'Thank you for your Adopt-a-Highway Application',
            MailTemplate.ApplicationCreation,
            undefined,
            {
                path: `${this.configService.get(
                    Config.CONFIRM_APP_URL,
                )}/${applicationToken}/${accessToken}`,
            },
        );
        await this.commandBus.execute(sendEmailMessage);
    }

    /**
     * Saves a new application and sends an email to the volunteer
     * @param {CreateApplicationCommand} command
     * @returns void
     */
    async execute(command: CreateApplicationCommand): Promise<void> {
        Logger.log(`Creating an application ${JSON.stringify(command)}`);

        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            const application = this.convertToApplications(command);
            application.status = ApplicationStatus.NotConfirmed;
            let app: Application = null;
            await queryRunner.manager
                .getRepository(Application)
                .save(application)
                .then((a) => (app = a))
                .catch((error: Error) => {
                    throw error;
                });

            await this.sendConfirmationEmail(
                app.primaryContactEmail,
                app.applicationToken,
                app.accessToken,
            ).catch((error: Error) => {
                throw error;
            });

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            Logger.error(
                `Rolling back database changes:\n${err.message}`,
                'CreateApplicationCommandHandler',
            );
            throw err;
        } finally {
            await queryRunner.release();
        }
    }
}
