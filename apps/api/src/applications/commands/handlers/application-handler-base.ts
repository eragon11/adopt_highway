import { Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApplicationsService } from 'src/applications';
import { Application } from 'src/applications/entities/application.entity';
import {
    GetApplicationByIdForUserQuery,
    GetApplicationByTokensQuery,
} from 'src/applications/queries/impl';
import { ApplicationStatus, Config, DocumentStatus } from 'src/common';
import { DistrictsService } from 'src/districts/districts.service';
import { User, District } from 'src/entities';
import { SendMailCommand, MailTemplate } from 'src/mail/command/impl';
import { GetDistrictCoordinatorsForCountyNumberQuery } from 'src/users/queries/impl';
import { getConnection } from 'typeorm';

export abstract class ApplicationHandlerBase {
    protected readonly logger = new Logger(ApplicationHandlerBase.name);

    constructor(
        protected readonly configService: ConfigService,
        protected readonly districtService: DistrictsService,
        protected readonly commandBus: CommandBus,
        protected readonly queryBus: QueryBus,
        protected readonly applicationService: ApplicationsService,
    ) {}

    protected async getApplicationById(
        applicationId: number,
        currentUser: User,
    ): Promise<Application> {
        Logger.debug(
            `Get application by id: ${applicationId}`,
            ApplicationHandlerBase.name,
        );
        const application = await this.queryBus.execute(
            new GetApplicationByIdForUserQuery(applicationId, currentUser),
        );

        // throw HTTP 404 Not Found if no application is returned
        if (!application) {
            throw new NotFoundException(
                `There is no application (id: ${applicationId}) for this user`,
            );
        }

        return application;
    }

    protected async getApplicationByTokens(
        applicationToken: string,
        accessToken: string,
    ): Promise<Application> {
        Logger.debug(
            'Getting application by tokens',
            ApplicationHandlerBase.name,
        );

        return await this.queryBus.execute(
            new GetApplicationByTokensQuery(applicationToken, accessToken),
        );
    }

    private async getDcEmailsByCountyNumber(countyNumber): Promise<string[]> {
        Logger.debug(
            `Getting District Coordinator emails for county number ${countyNumber}`,
            ApplicationHandlerBase.name,
        );

        const dc: User[] = await this.queryBus.execute(
            new GetDistrictCoordinatorsForCountyNumberQuery(countyNumber),
        );

        return dc.map((u: User) => u.emails[0].value);
    }

    protected async sendVolunteerConfirmationEmail(
        email: string,
        applicationToken: string,
        accessToken: string,
    ): Promise<void> {
        Logger.debug(
            `Sending volunteer email about application confirmation to ${email}`,
            ApplicationHandlerBase.name,
        );
        const sendEmailMessage = new SendMailCommand(
            [email],
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            'Your application for Adopt a Highway has been confirmed',
            MailTemplate.ApplicationConfirmation,
            undefined,
            {
                path: `${this.configService.get(
                    Config.VIEW_ANONYMOUS_APP_URL,
                )}/${applicationToken}/${accessToken}`,
            },
        );
        await this.commandBus.execute(sendEmailMessage);
    }

    protected async getDistrictForCountyNumber(
        requestedHighwayCountyNumber: number,
    ): Promise<District> {
        try {
            Logger.debug(
                'Get district from the county number',
                ApplicationHandlerBase.name,
            );
            return await this.districtService.GetDistrictForCountyNumber(
                requestedHighwayCountyNumber,
            );
        } catch (error) {
            Logger.error(error.message, 'getDistrictForCountyNumber');
            throw error;
        }
    }

    /**
     * Sends an email to the DC for the number provided
     * @param {number} countyNumber
     * @param {number} applicationId
     * @param {string} groupName
     */
    protected async sendDistrictCoordinatorEmail(
        countyNumber: number,
        applicationId: number,
        groupName: string,
    ): Promise<void> {
        try {
            Logger.debug(
                'Send district coordinator an application confirmation email',
                ApplicationHandlerBase.name,
            );
            const dcEmails = await this.getDcEmailsByCountyNumber(countyNumber);
            const adminEmail = this.configService.get<string>(
                Config.AAH_ADMIN_EMAIL,
            );
            const sendEmailMessage = new SendMailCommand(
                [...dcEmails, adminEmail],
                this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
                `A new Adopt a Highway application received from ${groupName}`,
                MailTemplate.AppSubmittedToDc,
                undefined,
                {
                    groupName,
                    path: `${this.configService.get(
                        Config.VIEW_ANONYMOUS_APP_URL,
                    )}/${applicationId}`,
                },
            );
            await this.commandBus.execute(sendEmailMessage);
        } catch (err) {
            Logger.error(err.message, 'sendDistrictCoordinatorEmail');
            throw err;
        }
    }

    protected async doConfirmTasks(app: Application): Promise<string> {
        try {
            await this.sendVolunteerConfirmationEmail(
                app.primaryContactEmail,
                app.applicationToken,
                app.accessToken,
            );

            await this.sendDistrictCoordinatorEmail(
                app.requestedHighwayCountyNumber,
                app.id,
                app.groupName,
            );

            return JSON.stringify(app.status);
        } catch (err) {
            throw err;
        }
    }

    protected async confirmApplicationByToken(
        applicationToken: string,
        accessToken: string,
    ): Promise<string> {
        Logger.debug(
            `Confirming an application by tokens: applicationToken:${applicationToken}/accessToken:${accessToken}`,
            ApplicationHandlerBase.name,
        );

        Logger.debug(
            'Confirming application by token',
            ApplicationHandlerBase.name,
        );

        await this.applicationService.confirmByTokens(
            applicationToken,
            accessToken,
        );

        const app = await this.getApplicationByTokens(
            applicationToken,
            accessToken,
        );

        await this.doConfirmTasks(app);
        return JSON.stringify(app.status);
    }

    protected async confirmApplicationById(
        applicationId: number,
        currentUser: User,
    ) {
        Logger.debug(
            `Confirming an application by id:${JSON.stringify(
                applicationId,
            )} for user: ${currentUser.id}/${currentUser.currentRole?.type}`,
            ApplicationHandlerBase.name,
        );

        const confirmApp = await this.getApplicationById(
            applicationId,
            currentUser,
        );

        if (!confirmApp) {
            throw new NotFoundException('No application for this user');
        }

        await this.applicationService.confirmById(applicationId);
        const app = await this.getApplicationById(applicationId, currentUser);
        await this.doConfirmTasks(app);
        return JSON.stringify(app.status);
    }

    /**
     * Updates application status for a given application Id
     * @param { number }applicationId
     * @param {ApplicationStatus} status
     */
    protected async updateApplicationStatus(
        applicationId: number,
        status: ApplicationStatus,
        muleSoftStatus: DocumentStatus,
    ) {
        try {
            const connection = await getConnection();
            const queryRunner = await connection.createQueryRunner();
            await queryRunner.manager
                .getRepository(Application)
                .createQueryBuilder('a')
                .update(Application)
                .set({
                    mulesoftStatus: () => `'${muleSoftStatus.toString()}'`,
                    status: () => `'${status.toString()}'`,
                    modifiedOn: () => `GETDATE()`,
                })
                .where(`APPLICATION_ID = :applicationId`, {
                    applicationId: applicationId,
                })
                .execute();
        } catch (err) {
            this.logger.error(
                `Could not update application status ${err.message}`,
                ApplicationHandlerBase.name,
            );
        }
    }
}
