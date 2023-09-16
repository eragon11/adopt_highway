import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import {
    AahTablesEnum,
    AuditLogEnum,
    Config,
    OrganizationType,
    Roles,
} from 'src/common/enum';
import {
    COULD_NOT_CREATE_USER,
    ERROR_ON_SAVE,
    USERNAME_ALREADY_EXISTS_ERROR,
    USER_CREATED,
} from 'src/constants/common.constants';
import {
    Address,
    Email,
    MaintenanceSection,
    Organization,
    Phone,
    Role,
    User,
} from 'src/entities';
import { UserContactType } from 'src/entities/enums';
import { SendMailCommand, MailTemplate } from 'src/mail/command/impl';
import { CreateUserRoleDto, UserProfileDto } from 'src/users/dtos';
import { UserNameAlreadyExistsException } from 'src/users/exceptions';
import { Repository } from 'typeorm';
import { CreateUserCommand } from '../impl';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
    private readonly logger: Logger = new Logger(CreateUserHandler.name);

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Organization)
        private readonly orgRepo: Repository<Organization>,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly commandBus: CommandBus,
        private readonly configService: ConfigService,
    ) {}

    /**
     * Creates a new role
     * @param user
     * @param roleType
     * @param organization
     * @returns new role
     */
    private createRole(
        user: User,
        roleType: Roles,
        organization: Organization,
    ): Role {
        const role = new Role();
        role.user = user;
        role.type = roleType;
        role.organization = organization;
        return role;
    }

    /**
     *
     * @param role dto containing the role type
     * @param user the user for hte role
     * @returns {Role} entity
     */
    private async mapRoleDtoToRole(
        role: CreateUserRoleDto,
        user: User,
    ): Promise<Role> {
        // find the existing role, or set up this as the new role
        switch (role.roleType) {
            case Roles.DistrictCoordinator:
                const newRoleOrgDistrict = await this.orgRepo.findOne({
                    district: { number: role.districtNumber },
                });
                return this.createRole(user, role.roleType, newRoleOrgDistrict);
            case Roles.MaintenanceCoordinator:
                const newRoleOrgOffice = await this.orgRepo
                    .createQueryBuilder('o')
                    .leftJoinAndMapOne(
                        'o.maintenanceSection',
                        MaintenanceSection,
                        'ms',
                        'o.ORGANIZATION_ID = ms.ORGANIZATION_ID',
                    )
                    .where(
                        'ms.DISTRICT_NUMBER = :districtNumber AND ms.NUMBER = :officeNumber',
                        {
                            districtNumber: role.districtNumber,
                            officeNumber: role.officeNumber,
                        },
                    )
                    .getOneOrFail();
                return this.createRole(user, role.roleType, newRoleOrgOffice);
            default:
                const txDotOrg: Organization = await this.orgRepo.findOne({
                    type: OrganizationType.TxDOT,
                });
                return this.createRole(user, role.roleType, txDotOrg);
        }
    }

    /**
     * Saves a new user
     * @param command
     * @returns
     */
    private async saveCreatedUser(command: CreateUserCommand): Promise<User> {
        const createUser = new User(
            command.userName,
            command.firstName,
            command.lastName,
            command.status,
        );

        if (
            command.address1?.trim() !== '' ||
            command.address2?.trim() !== '' ||
            command.city?.trim() !== '' ||
            command.postalCode?.trim() !== ''
        ) {
            const address = new Address(
                command.address1,
                command.address2,
                command.city,
                command.state,
                command.postalCode,
                UserContactType.Primary,
                'Y',
                'User updated',
            );
            createUser.addresses = [address];
        }

        if (command.email?.trim() !== '') {
            const email = new Email();
            email.comment = 'New user';
            email.type = UserContactType.Primary;
            email.value = command.email.trim();
            createUser.emails = [email];
        }

        if (command.contactNumber?.trim() !== '') {
            const phone = new Phone();
            phone.comment = 'New user';
            phone.type = UserContactType.Primary;
            phone.value = command.contactNumber.trim();
            createUser.phones = [phone];
        }

        const roles = new Array<Role>();

        await Promise.all(
            command.roles.map(async (r) => {
                const role = await this.mapRoleDtoToRole(r, createUser);
                roles.push(role);
            }),
        );

        createUser.roles = roles;

        const saveUser = await this.userRepo
            .save(createUser)
            .catch((error: Error) => {
                Logger.error(ERROR_ON_SAVE, 'saveCreatedUser');
                switch (true) {
                    case error.message.includes(USERNAME_ALREADY_EXISTS_ERROR):
                        throw new UserNameAlreadyExistsException(
                            command.userName,
                        );
                    default:
                        throw new BadRequestException(COULD_NOT_CREATE_USER);
                }
            });
        return saveUser;
    }

    /**
     * Logs our user created action
     * @param userName
     * @param userId
     */
    private async logAction(userName: string, userId: number): Promise<void> {
        // log our user creation
        const auditLogCommand = new CreateAuditLogCommand(
            userName,
            AahTablesEnum.userPerson,
            userId,
            USER_CREATED,
            AuditLogEnum.Create,
        );
        await this.commandBus.execute(auditLogCommand);
    }

    /**
     * Sends a welcome internal user email to the user's primary email
     * @param {User} user
     */
    private async sendEmail(user: User): Promise<void> {
        const emailValue = user.emails.filter(
            (email) => email.type === UserContactType.Primary,
        )[0].value;

        const email: SendMailCommand = new SendMailCommand(
            emailValue,
            this.configService.get<string>(Config.AAH_ADMIN_EMAIL),
            'You have been added to Adopt A Highway',
            MailTemplate.CreateNewInternalUser,
            null,
            {
                aahAdmin: this.configService.get<string>(
                    Config.AAH_ADMIN_EMAIL,
                ),
                mail: emailValue,
                aahWebsiteUrl: this.configService.get<string>(
                    Config.SAML_LOGOUT_RETURN,
                ),
            },
            [],
            null,
            null,
        );
        await this.commandBus.execute(email);
    }

    /**
     * Creates a new User
     * @param {CreateUserCommand} command
     * @returns the new User created
     */
    async execute(command: CreateUserCommand): Promise<UserProfileDto> {
        try {
            // save the user
            const user: User = await this.saveCreatedUser(command);

            // log the action
            await this.logAction(command.currentUser.userName, user.id).catch(
                (reason) => {
                    this.logger.error(
                        `Could not log the action of creating an internal user ${reason}`,
                    );
                    throw new InternalServerErrorException(
                        'Log action unsuccessful after user was created',
                    );
                },
            );

            // send email to the user
            await this.sendEmail(user).catch((reason) => {
                this.logger.error(
                    `Could not send email when creating an internal user ${reason}`,
                );
                throw new InternalServerErrorException(
                    'Notification email could not be sent after user was created',
                );
            });

            return this.mapper.map(user, UserProfileDto, User);
        } catch (err) {
            this.logger.error(err);
            throw err;
        }
    }
}
