import {
    BadRequestException,
    InternalServerErrorException,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { Application } from 'src/applications/entities/application.entity';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import { AahTablesEnum, AuditLogEnum, Roles } from 'src/common';
import { ConvertObjectToPartialEntity } from 'src/utils/typeorm.utils';
import { getConnection, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateApplicationByIdCommand } from '../impl';
import { ApplicationStatus } from 'src/common/enum';
import { SegmentNotAvailableException } from 'src/applications/exceptions';
import { GetAvailableSegmentByIdQuery } from 'src/segments/queries/impl';
import { Segment, User } from 'src/entities';
import { GetDistrictCoordinatorsForSegmentQuery } from 'src/users/queries/impl/get-district-coordinator-for-segment';
import { GetApplicationByIdForUserQuery } from 'src/applications/queries';

@CommandHandler(UpdateApplicationByIdCommand)
export class UpdateApplicationByIdCommandHandler
    implements ICommandHandler<UpdateApplicationByIdCommand>
{
    private readonly logger = new Logger(
        UpdateApplicationByIdCommandHandler.name,
    );

    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    private async getSegment(
        proposedSegmentId: string,
        currentUser: User,
    ): Promise<Segment> {
        const segment: Segment = await this.queryBus.execute(
            new GetAvailableSegmentByIdQuery(proposedSegmentId, currentUser),
        );

        if (segment === null) {
            throw new SegmentNotAvailableException(proposedSegmentId);
        }

        return segment;
    }

    private async getValidTxDotContactsForAahSegmentId(
        proposedSegmentId: string,
        currentUser: User,
    ): Promise<User[]> {
        return await this.queryBus.execute(
            new GetDistrictCoordinatorsForSegmentQuery(
                proposedSegmentId,
                currentUser,
            ),
        );
    }

    private isSignChanged(
        app: Application,
        command: UpdateApplicationByIdCommand,
    ) {
        let signNameChanged = false;

        const appSign1 = (command.signLine_1 ?? '').trim();
        const appSign2 = (command.signLine_2 ?? '').trim();
        const appSign3 = (command.signLine_3 ?? '').trim();
        const appSign4 = (command.signLine_4 ?? '').trim();

        Object.entries(app).forEach(([key, value]) => {
            // Check to see if any of the 4 sign name fields have been updated in the request
            if (key.includes('sign')) {
                // determine if the updated sign name is different from values in the DB
                // if so update the variable so the application status can be set back to RequestSignApproval
                if (key.includes('1')) {
                    if (appSign1 !== (value ?? '').trim()) {
                        signNameChanged = true;
                    }
                } else if (key.includes('2')) {
                    if (appSign2 !== (value ?? '').trim()) {
                        signNameChanged = true;
                    }
                } else if (key.includes('3')) {
                    if (appSign3 !== (value ?? '').trim()) {
                        signNameChanged = true;
                    }
                } else if (key.includes('4')) {
                    if (appSign4 !== (value ?? '').trim()) {
                        signNameChanged = true;
                    }
                }
            }
        });
        return signNameChanged;
    }

    private async getStatusForSignChange(
        command: UpdateApplicationByIdCommand,
        currentAppStatus: ApplicationStatus,
        app: Application,
        currentUser: User,
    ): Promise<ApplicationStatus> {
        const changedSignName = this.isSignChanged(app, command);
        if (!changedSignName) {
            return currentAppStatus;
        }

        const mustChangeSignName =
            currentAppStatus === ApplicationStatus.SignNameDenied;

        if (mustChangeSignName && !changedSignName) {
            throw new BadRequestException('Please change the sign name');
        }

        if (Roles.Administrator !== currentUser.currentRole.type) {
            // update the application status - if the sign name was updated, then reset it to Request Sign Approval, else
            // set it to the status of 'Correct sign name'
            return ApplicationStatus.RequestSignApproval;
        }

        return currentAppStatus;
    }

    private async updateCommandFromSegmentChange(
        command: UpdateApplicationByIdCommand,
        currentUser: User,
    ): Promise<UpdateApplicationByIdCommand> {
        try {
            const proposedSegmentId = command.aahSegmentId;
            const segment = await this.getSegment(
                proposedSegmentId,
                currentUser,
            );
            command.lengthOfAdoptedSection = segment.segmentLengthMiles;
            command.requestedHighwayCountyNumber = segment.countyNumber;
            command.aahRouteName = segment.aahRouteName;
            return command;
        } catch (err) {
            this.logger.error(`${JSON.stringify(err)}`);
            throw err;
        }
    }

    private updateApplicationDetails(
        application: QueryDeepPartialEntity<Application>,
        command: UpdateApplicationByIdCommand,
    ) {
        if (command.agreementStartDate) {
            application.agreementStartDate = command.agreementStartDate;
        }

        if (command.agreementEndDate) {
            application.agreementEndDate = command.agreementEndDate;
        }

        if (command.requiredPickupsPerYear) {
            application.cleaningCycleOfAdoptedSection =
                command.requiredPickupsPerYear;
            application.requiredPickupsPerYear = command.requiredPickupsPerYear;
        }

        if (command.pickupsStartDate) {
            application.firstScheduledPickup = command.pickupsStartDate;
            application.pickupsStartDate = command.pickupsStartDate;
        }

        if (command.agreementEndDate) {
            application.pickupsEndDate = command.agreementEndDate;
        }
        return application;
    }

    private async createApplicationForUpdate(
        command: UpdateApplicationByIdCommand,
        applicationId: number,
        currentUser: User,
    ): Promise<QueryDeepPartialEntity<Application>> {
        const appFromDb: Application = (await this.queryBus.execute(
            new GetApplicationByIdForUserQuery(applicationId, currentUser),
        )) as Application;

        let aahSegmentId: number = appFromDb.aahSegmentId;

        const changingSegment =
            command.aahSegmentId !== undefined &&
            appFromDb.aahSegmentId !== parseInt(command.aahSegmentId, 10);

        let nextStatus: ApplicationStatus = appFromDb.status;

        if (changingSegment) {
            aahSegmentId = parseInt(command.aahSegmentId, 10);
            if (
                appFromDb.status === ApplicationStatus.SegmentAssignmentNeeded
            ) {
                nextStatus = ApplicationStatus.RequestSignApproval;
            }

            command = await this.updateCommandFromSegmentChange(
                command,
                currentUser,
            );
        }

        command = this.handleSignChange(command);

        command = await this.handleTxDotContactChange(
            aahSegmentId,
            command,
            currentUser,
        );

        // Update needs a partial of our application
        let application: QueryDeepPartialEntity<Application> =
            ConvertObjectToPartialEntity<Application>(command);

        application.status = nextStatus;

        // get the latest sign status
        const signStatus = await this.getStatusForSignChange(
            command,
            nextStatus,
            appFromDb,
            currentUser,
        );

        application = this.updateApplicationDetails(application, command);

        if ((application.status = signStatus)) {
            application.status = signStatus;
        }

        application.modifiedOn = new Date();

        return application;
    }

    private async GetValidContactWithUserId(
        aahSegmentId: number,
        command: UpdateApplicationByIdCommand,
        currentUser: User,
    ) {
        if (!command.txdotContactUserId) {
            this.logger.debug('No TxDOT contact, leaving early');
            return null;
        }

        const userId = command.txdotContactUserId;

        const validContacts = await this.getValidTxDotContactsForAahSegmentId(
            aahSegmentId.toString(),
            currentUser,
        );

        if (validContacts.length === 0) {
            throw new InternalServerErrorException(
                `No valid district coordinators exist for this segment (AAH Segment ID: ${aahSegmentId})`,
            );
        }

        const contactsWithUserId = validContacts.filter(
            (c: User) => c.id === userId,
        );

        if (contactsWithUserId.length === 0) {
            throw new BadRequestException(
                `You did not provide a valid TxDOT representative for this segment (User ID: ${command.txdotContactUserId})`,
            );
        }

        return contactsWithUserId[0];
    }

    private async handleTxDotContactChange(
        aahSegmentId: number,
        command: UpdateApplicationByIdCommand,
        currentUser: User,
    ): Promise<UpdateApplicationByIdCommand> {
        try {
            // get our user contact
            const contact = await this.GetValidContactWithUserId(
                aahSegmentId,
                command,
                currentUser,
            );

            // do not update if there is no TxDOT Contact
            if (!contact) {
                delete command['txdotContactUserId'];
                delete command['txdotContactEmail'];
                delete command['txdotContactPhoneNumber'];
                delete command['txdotContactFullName'];
                return command;
            }

            command.txdotContactUserId = contact.id;
            command.txdotContactEmail = contact.emails[0].value;
            command.txdotContactPhoneNumber = contact.phones[0].value;
            command.txdotContactFullName = contact.fullName;
            return command;
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }

    public handleSignChange(
        command: UpdateApplicationByIdCommand,
    ): UpdateApplicationByIdCommand {
        if ((command.signLine_1 ?? '').trim() === '') {
            throw new BadRequestException('Sign Line 1 is required');
        }

        if (
            command.signLine_1 === undefined &&
            command.signLine_2 === undefined &&
            command.signLine_3 === undefined &&
            command.signLine_4 === undefined
        ) {
            return command;
        }

        const arr = [
            command.signLine_1?.trim() ?? '',
            command.signLine_2?.trim() ?? '',
            command.signLine_3?.trim() ?? '',
            command.signLine_4?.trim() ?? '',
        ];
        const filterOutEmpties = arr.filter((v) => v !== '');

        const maxCharacters = filterOutEmpties[3]?.trim() !== '' ? 13 : 11;

        if (
            filterOutEmpties.filter((v) => v?.trim().length > maxCharacters)
                .length > 0
        ) {
            throw new BadRequestException(
                'Please verify that sign has fewer than the maximum allowable characters per line',
            );
        }

        // re-assign sign lines to remove empties
        command.signLine_1 = filterOutEmpties[0];
        command.signLine_2 = filterOutEmpties[1] ?? '';
        command.signLine_3 = filterOutEmpties[2] ?? '';
        command.signLine_4 = filterOutEmpties[3] ?? '';

        return command;
    }

    async execute(command: UpdateApplicationByIdCommand): Promise<void> {
        this.logger.log(
            `Updating an application by ID ${JSON.stringify(command)}`,
        );

        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            // retain the currentUser and applicationId, then remove them from command
            const applicationId = command.applicationId;
            const currentUser = command.currentUser;

            delete command['applicationId'];
            delete command['currentUser'];

            const application = await this.createApplicationForUpdate(
                command,
                applicationId,
                currentUser,
            );

            const result: UpdateResult = await queryRunner.manager
                .createQueryBuilder()
                .update(Application)
                .set(application)
                .where(
                    `APPLICATION_ID = :appId AND 
                    EXISTS(SELECT r1.USER_ID
                        FROM aah.ORGANIZATION o1
                            INNER JOIN aah.ROLE r1 ON o1.ORGANIZATION_ID = r1.ORGANIZATION_ID
                        WHERE r1.TYPE = :adminRoleType AND r1.USER_ID = :adminUserId AND r1.ROLE_ID = :adminRoleId
                    UNION 
                        SELECT r2.USER_ID
                        FROM aah.ORGANIZATION o2
                            INNER JOIN aah.DISTRICT d2 ON o2.ORGANIZATION_ID = d2.ORGANIZATION_ID
                            INNER JOIN aah.ROLE r2 ON o2.ORGANIZATION_ID = r2.ORGANIZATION_ID
                            INNER JOIN aah.USER_PERSON u1 ON r2.USER_ID = u1.USER_ID
                            INNER JOIN aah.COUNTY_DISTRICT cd1 ON cd1.DISTRICT_ID = d2.DISTRICT_ID
                            INNER JOIN aah.COUNTY c1 ON cd1.COUNTY_ID = c1.COUNTY_ID
                            INNER JOIN aah.APPLICATIONS a1 ON c1.NUMBER = a1.REQUESTED_HIGHWAY_COUNTY_NUMBER
                        WHERE a1.APPLICATION_ID = :dcAppId AND
                            r2.TYPE = :dcRoleType
                            AND r2.USER_ID = :dcUserId
                            AND r2.ROLE_ID = :dcRoleId)`,
                    {
                        appId: applicationId,
                        adminRoleType: Roles.Administrator,
                        adminUserId: currentUser.id,
                        adminRoleId: currentUser.currentRole.id,
                        dcAppId: applicationId,
                        dcRoleType: Roles.DistrictCoordinator,
                        dcUserId: currentUser.id,
                        dcRoleId: currentUser.currentRole.id,
                    },
                )
                .execute();

            // throw unauthorized if zero records were updated
            if (result.affected === 0) {
                throw new UnauthorizedException();
            }

            // Record the changes in audit log
            await this.commandBus.execute(
                new CreateAuditLogCommand(
                    currentUser.userName,
                    AahTablesEnum.applications,
                    applicationId,
                    'Application updated',
                    AuditLogEnum.Update,
                ),
            );
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Rolling back database changes`);
            this.logger.error(`${err.message}`);
            throw err;
        } finally {
            await queryRunner.release();
        }
        return;
    }
}
