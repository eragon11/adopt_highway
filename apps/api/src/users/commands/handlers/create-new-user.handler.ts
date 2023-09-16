import {
    BadRequestException,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import { AahTablesEnum, AuditLogEnum, OrganizationType } from 'src/common/enum';
import {
    COULD_NOT_CREATE_USER,
    ERROR_ON_SAVE,
    USERNAME_ALREADY_EXISTS_ERROR,
    USER_CREATED,
} from 'src/constants/common.constants';
import { Address, Email, Organization, Phone, Role, User } from 'src/entities';
import { UserContactType } from 'src/entities/enums';
import { UserNameAlreadyExistsException } from 'src/users/exceptions';
import { Repository } from 'typeorm';
import { CreateNewUserCommand } from '../impl';

@CommandHandler(CreateNewUserCommand)
export class CreateNewUserHandler
    implements ICommandHandler<CreateNewUserCommand>
{
    private readonly logger: Logger = new Logger(CreateNewUserHandler.name);

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Organization)
        private readonly orgRepo: Repository<Organization>,
        private readonly commandBus: CommandBus,
    ) {}

    /**
     * Saves a new user
     * @param command
     * @returns
     */
    private async saveCreatedUser(
        command: CreateNewUserCommand,
    ): Promise<User> {
        const user = new User(
            command.userName,
            command.firstName,
            command.lastName,
            command.status,
        );

        const organization = new Organization();
        organization.type = OrganizationType.Group;
        await this.orgRepo.save(organization);

        const role = new Role();
        role.type = command.role;
        role.organization = organization;
        organization.role = role;
        role.user = user;
        user.roles = [role];

        const email = new Email();
        email.value = command.email;
        email.type = UserContactType.Primary;
        email.user = user;
        user.emails = [email];

        const phone = new Phone();
        phone.value = command.contactNumber;
        phone.type = UserContactType.Primary;
        phone.user = user;
        user.phones = [phone];

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
        address.user = user;
        user.addresses = [address];

        const saveUser = await this.userRepo
            .save(user)
            .catch((error: Error) => {
                this.logger.error(ERROR_ON_SAVE);
                switch (true) {
                    case error.message.includes(USERNAME_ALREADY_EXISTS_ERROR):
                        throw new UserNameAlreadyExistsException(
                            command.userName,
                        );
                    default:
                        throw new BadRequestException(COULD_NOT_CREATE_USER);
                }
            });
        // update audit log
        await this.commandBus.execute(
            new CreateAuditLogCommand(
                command.currentUser.userName,
                AahTablesEnum.userPerson,
                saveUser.id,
                'Created new volunteer user',
                AuditLogEnum.Create,
            ),
        );

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
     * Creates a new User
     * @param {CreateUserCommand} command
     * @returns the new User created
     */
    async execute(command: CreateNewUserCommand): Promise<User> {
        try {
            // save the user
            const user: User = await this.saveCreatedUser(command);

            // log the action
            await this.logAction(command.currentUser.userName, user.id);

            return user;
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException('Could not create user');
        }
    }
}
