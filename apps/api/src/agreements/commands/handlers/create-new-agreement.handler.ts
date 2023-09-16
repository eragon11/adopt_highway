import { InternalServerErrorException, Logger } from '@nestjs/common';
import {
    CommandHandler,
    ICommandHandler,
    CommandBus,
    QueryBus,
} from '@nestjs/cqrs';
import { Application, GetApplicationByIdForUserQuery } from 'src/applications';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import {
    AahTablesEnum,
    AgreementStatusEnum,
    AuditLogEnum,
    OrganizationType,
    Roles,
    SegmentStatus,
    SignStatuses,
    UserStatusEnum,
} from 'src/common';
import { CountiesService } from 'src/counties/counties.service';
import {
    Agreement,
    GroupContact,
    GroupSponsor,
    Organization,
    Segment,
    Sign,
    SignStatus,
    User,
} from 'src/entities';
import { SegmentsService } from 'src/segments/segments.service';
import { CreateNewUserCommand } from 'src/users/commands/impl/create-new-user.command';
import { GetUserByUsername } from 'src/users/queries/impl';
import { getConnection } from 'typeorm';
import { CreateNewAgreementCommand } from '../impl';

@CommandHandler(CreateNewAgreementCommand)
export class CreateNewAgreementHandler
    implements ICommandHandler<CreateNewAgreementCommand, Agreement>
{
    private logger: Logger = new Logger(CreateNewAgreementHandler.name);
    /**
     *
     */
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly countyService: CountiesService,
        private readonly segmentService: SegmentsService,
    ) {}

    /**
     * Creates a new user or retrieves an existin user based on the email
     * @param email
     * @param firstName
     * @param lastName
     * @param isPrimary
     * @param phoneNumber
     * @param address1
     * @param address2
     * @param city
     * @param postalCode
     * @param currentUser
     * @returns
     */
    private async createOrGetUser(
        email: string,
        firstName: string,
        lastName: string,
        phoneNumber: string,
        address1: string,
        address2: string,
        city: string,
        postalCode: string,
        currentUser: User,
    ): Promise<User> {
        // see if the user already exists
        let user: User = await this.queryBus.execute(
            new GetUserByUsername(email),
        );

        if (!user) {
            const command = new CreateNewUserCommand(
                firstName,
                lastName,
                email,
                email,
                phoneNumber,
                UserStatusEnum.Active,
                address1,
                address2,
                city,
                'TX',
                postalCode,
                Roles.Volunteer,
                currentUser,
            );
            user = (await this.commandBus.execute(command)) as User;
        }

        return user;
    }

    private async createGroupContact(
        groupSponsor: GroupSponsor,
        user: User,
        isPrimary: boolean,
    ): Promise<GroupContact> {
        // create the group contact
        const groupContact = new GroupContact();
        groupContact.groupSponsor = groupSponsor;
        groupContact.user = user;
        groupContact.isPrimary = isPrimary;

        return groupContact;
    }

    /**
     * Creates a new group sponsor and its organization, and associates it to our new agreement
     * @param {Application} application
     * @param {Agreement} agreement
     * @returns {GroupSponsor} newly created group sponsor
     */
    private async createGroupSponsor(
        application: Application,
        agreement: Agreement,
    ): Promise<GroupSponsor> {
        const county = await this.countyService.GetByNumber(
            application.requestedHighwayCountyNumber,
        );

        const organization = new Organization();
        organization.type = OrganizationType.Group;

        const groupSponsor = new GroupSponsor();
        groupSponsor.name = application.groupName;
        groupSponsor.organization = organization;
        groupSponsor.initialContactDate = application.createdOn;
        groupSponsor.estimatedVolunteerCount =
            application.estimateNumberOfVolunteers;
        groupSponsor.applicationSendDate = application.agreementStartDate;
        groupSponsor.county = county;
        groupSponsor.type = application.groupType;
        groupSponsor.agreements = [agreement];
        groupSponsor.comment = ''; // creating with a blank comment

        return groupSponsor;
    }

    /**
     * Saves new agreement info to the segment
     * @param application
     * @param agreement
     * @param currentUser
     * @returns updated segment
     */
    private async updateSegment(
        application: Application,
        agreement: Agreement,
        currentUser: User,
    ): Promise<Segment> {
        const segment: Segment = await this.getSegment(
            application,
            currentUser,
        );
        segment.groupName = application.groupName;
        segment.agreement = agreement;
        // to update with new Segment statuses
        segment.segmentStatus = SegmentStatus.Pending;
        segment.segmentStatus = SegmentStatus.Pending;
        const updated = await this.segmentService.save(segment);
        return updated;
    }

    /**
     * Creates a new agreement with all of its relations
     * @param { number } applicationId
     * @param { User } currentUser
     * @returns { Agreement } new agreement
     */
    private async createAgreement(
        application: Application,
        primaryUser: User,
        secondaryUser: User,
        currentUser: User,
    ): Promise<Agreement> {
        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            // create a new agreement
            const agreement: Agreement = new Agreement();
            agreement.beginDate = application.agreementStartDate;
            agreement.endDate = application.agreementEndDate;
            agreement.status = AgreementStatusEnum.Pending;
            agreement.applicationToken = application.applicationToken;
            agreement.comment = 'Created new agreement due to signing request';

            // create group sponsor
            const groupSponsor = await this.createGroupSponsor(
                application,
                agreement,
            );
            agreement.groupSponsor = groupSponsor;

            // get the primary contact info
            const primaryContact = await this.createGroupContact(
                groupSponsor,
                primaryUser,
                true,
            );

            // get the secondary (alternate) contact info
            const secondaryContact = await this.createGroupContact(
                groupSponsor,
                secondaryUser,
                false,
            );

            groupSponsor.contacts = [primaryContact, secondaryContact];

            // create the segment relationship
            const segment = await this.updateSegment(
                application,
                agreement,
                currentUser,
            );
            agreement.segment = segment;

            const sign = await this.createSign(application, agreement);
            agreement.sign = sign;

            const newAgreement = await queryRunner.manager
                .getRepository(Agreement)
                .save(agreement);

            await queryRunner.commitTransaction();
            return newAgreement;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                `Could not create a new agreement:\n${err.message}`,
            );
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Creates a new sign with initial pending mock status for agreement
     * @param {Application} application
     * @param {Agreement} agreement
     * @returns {Sign} newly created sign for the Agreement
     */
    private createSign(application: Application, agreement: Agreement) {
        const signStatus: SignStatus = new SignStatus();
        signStatus.status = SignStatuses.SignMockupPending;
        signStatus.beginDate = new Date();

        const sign = new Sign();
        sign.agreement = agreement;
        signStatus.sign = sign;
        sign.signStatuses = [signStatus];
        sign.comment = `Record created`;
        sign.line1 = application.signLine_1;
        sign.line2 = application.signLine_2;
        sign.line3 = application.signLine_3;
        sign.line4 = application.signLine_4;

        return sign;
    }

    /**
     * Returns the segment from the application by the aahSegmentId
     * @param {Application} application
     * @returns {Segment} segment for the application
     */
    private async getSegment(
        application: Application,
        currentUser: User,
    ): Promise<Segment> {
        return this.segmentService.findAvailableSegmentById(
            application.aahSegmentId.toString(),
            currentUser,
        );
    }

    private async createOrGetUsers(
        application: Application,
        currentUser: User,
    ): Promise<User[]> {
        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();
        try {
            const primaryUser: User = await this.createOrGetUser(
                application.primaryContactEmail,
                application.primaryContactFirstName,
                application.primaryContactLastName,
                application.primaryContactPhoneNumber,
                application.primaryContactAddressLine1,
                application.primaryContactAddressLine2,
                application.primaryContactCity,
                application.primaryContactPostalCode,
                currentUser,
            );

            const secondaryUser: User = await this.createOrGetUser(
                application.secondaryContactEmail,
                application.secondaryContactFirstName,
                application.secondaryContactLastName,
                application.secondaryContactPhoneNumber,
                application.secondaryContactAddressLine1,
                application.secondaryContactAddressLine2,
                application.secondaryContactCity,
                application.secondaryContactPostalCode,
                currentUser,
            );
            await queryRunner.commitTransaction();
            return [primaryUser, secondaryUser];
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Could not create the users:\n${err.message}`);
            throw err;
        }
    }

    /**
     *
     * @param command
     * @returns
     */
    async execute(command: CreateNewAgreementCommand): Promise<Agreement> {
        try {
            this.logger.debug(
                'Initiated the command handler to create the application',
            );

            // get the application
            const application: Application = await this.queryBus.execute(
                new GetApplicationByIdForUserQuery(
                    command.applicationId,
                    command.currentUser,
                ),
            );

            // get the users
            const users = await this.createOrGetUsers(
                application,
                command.currentUser,
            );

            // create the agreement from the application
            const agreement: Agreement = await this.createAgreement(
                application,
                users[0],
                users[1],
                command.currentUser,
            );

            // update audit log
            await this.commandBus.execute(
                new CreateAuditLogCommand(
                    command.currentUser.userName,
                    AahTablesEnum.agreement,
                    agreement.agreementId,
                    'Created new agreement',
                    AuditLogEnum.Create,
                ),
            );

            return agreement;
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException(
                `Could not convert the application (${command.applicationId}) into an agreement`,
            );
        }
    }
}
