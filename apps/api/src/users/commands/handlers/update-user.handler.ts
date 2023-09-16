import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { BadRequestException, Logger } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import {
    AahTablesEnum,
    AuditLogEnum,
    OrganizationType,
    Roles,
} from 'src/common/enum';
import {
    COULD_NOT_UPDATE_USER,
    USERNAME_ALREADY_EXISTS_ERROR,
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
import { UpdateUserRoleDto, UserProfileDto } from 'src/users/dtos';
import {
    UserNameAlreadyExistsException,
    UserNotFoundException,
} from 'src/users/exceptions';
import { Repository } from 'typeorm';
import { UpdateUserCommand } from '../impl';

// file scoped variables
const UPDATE_USER_MESSAGE = 'User updated';

/**
 * Updates a user
 */
@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
    private readonly logger: Logger = new Logger(UpdateUserHandler.name);
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Organization)
        private readonly orgRepo: Repository<Organization>,
        @InjectMapper() private readonly mapper: Mapper,
        private readonly commandBus: CommandBus,
    ) {}

    /**
     *
     * @param userId
     * @param email primary email value;
     * @returns {Promise<Email[]>} of the emails with the new primary email value
     */
    private async updatePrimaryEmail(
        userId: number,
        email: string,
        comment: string,
    ): Promise<Email[]> {
        try {
            if (!email) {
                return undefined;
            }

            // update primary email with latest value
            const user = await this.userRepo.findOne(userId);
            const userEmails = user.emails;

            // update existing value
            if (userEmails?.length >= 1) {
                const primaryEmail = userEmails?.filter(
                    (email) => email.type === UserContactType.Primary,
                )[0];
                primaryEmail.value = email;
                primaryEmail.comment = comment;
                return user.emails;
            }

            const newEmail = new Email();
            newEmail.value = email;
            newEmail.type = UserContactType.Primary;
            newEmail.userId = userId;
            newEmail.comment = comment;

            // other wise
            return new Array<Email>(1).fill(newEmail);
        } catch (err) {
            throw new Error("Could not set the user's email");
        }
    }

    /**
     *
     * @param userId
     * @param phone primary phone value;
     * @returns {Promise<Phone[]>} of the phones with the new primary phone value
     */
    private async updatePrimaryPhone(
        userId: number,
        phone: string,
        comment: string,
    ): Promise<Phone[]> {
        try {
            if (!phone) {
                return undefined;
            }

            // update primary phone with latest value
            const user = await this.userRepo.findOne(userId);
            const userPhones = user.phones;

            // update existing value
            if (userPhones?.length >= 1) {
                const primaryPhone = userPhones?.filter(
                    (phone) => phone.type === UserContactType.Primary,
                )[0];
                primaryPhone.value = phone;
                primaryPhone.comment = comment;
                return user.phones;
            }

            const newPhone = new Phone();
            newPhone.value = phone;
            newPhone.type = UserContactType.Primary;
            newPhone.comment = comment;

            // other wise
            return new Array<Phone>(1).fill(newPhone);
        } catch (err) {
            throw new Error("Could not set the user's phone");
        }
    }

    /**
     *
     * @param userId
     * @param address
     * @returns
     */
    private async updatePrimaryAddress(
        userId: number,
        address: Address,
    ): Promise<Address[]> {
        try {
            if (!address) {
                return undefined;
            }

            // update primary phone with latest value
            const user = await this.userRepo.findOne(userId);
            const userAddresses = user.addresses;

            // update existing value
            if (userAddresses?.length >= 1) {
                const primaryAddress = userAddresses?.filter(
                    (address) => address.type === UserContactType.Primary,
                )[0];
                primaryAddress.addressLine1 = address.addressLine1;
                primaryAddress.addressLine2 = address.addressLine2;
                primaryAddress.city = address.city;
                primaryAddress.state = address.state;
                primaryAddress.postalCode = address.postalCode;
                primaryAddress.primaryContact = address.primaryContact;
                primaryAddress.type = UserContactType.Primary;
                primaryAddress.user = user;
                return user.addresses;
            }

            // other wise
            return new Array<Address>(1).fill(address);
        } catch (err) {
            throw new Error("Could not set the user's address");
        }
    }

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
        role: UpdateUserRoleDto,
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
     * Finds a matching role from a user's existing roles
     * @param role
     * @param user
     * @returns {Role} from user's existing roles
     */
    async getExistingUserRole(
        role: UpdateUserRoleDto,
        user: User,
    ): Promise<Role> {
        const userRoles = user.roles;
        let existingRole: Role;
        // find the existing role, or set up this as the new role
        switch (role.roleType) {
            case Roles.DistrictCoordinator:
                const matchingDcs = userRoles.filter((r: Role) => {
                    return (
                        r.type == Roles.DistrictCoordinator &&
                        r.organization?.district?.number === role.districtNumber
                    );
                });
                if (matchingDcs.length === 1) {
                    existingRole = matchingDcs[0];
                }
                break;
            case Roles.MaintenanceCoordinator:
            case Roles.SignCoordinator:
            case Roles.MaintenanceInField:
                const matchingMcs = userRoles.filter((r: Role) => {
                    return (
                        r.type == Roles.MaintenanceCoordinator &&
                        r.organization?.maintenanceSection?.district?.number ===
                            role.districtNumber &&
                        r.organization?.maintenanceSection?.number ===
                            role.officeNumber
                    );
                });
                if (matchingMcs.length === 1) {
                    existingRole = matchingMcs[0];
                }
                break;
            case Roles.Administrator:
            case Roles.ReadOnlyUser:
            case Roles.Approver:
            case Roles.SupportTeam:
            case Roles.Volunteer:
                const matchingOthers = userRoles.filter(
                    (r: Role) => r.type === role.roleType,
                );
                if (matchingOthers.length === 1) {
                    existingRole = matchingOthers[0];
                }
                break;
            default:
                throw new Error(`${role.roleType} is not a supported role`);
                break;
        }

        // map the DTO to a real role
        return existingRole;
    }

    /**
     *
     * @param userId id of the user being updated
     * @param {Role[]} roles
     */
    private async updateUserRoles(
        userId: number,
        roles: UpdateUserRoleDto[],
    ): Promise<Role[]> {
        // make sure they pass a userid
        if (!userId || userId === 0) {
            throw new UserNotFoundException(0);
        }

        if (!roles || roles.length === 0) {
            throw new BadRequestException(null, 'All users must have a role');
        }
        // updated, new and existing roles
        const updatedRoles = new Array<Role>();

        // get user's roles
        const user = await this.userRepo.findOne(userId);

        await Promise.all(
            roles.map(async (role: UpdateUserRoleDto) => {
                const existingRole = await this.getExistingUserRole(role, user);
                const updatedRole = await this.mapRoleDtoToRole(role, user);
                // add the existing user role as the new role
                updatedRoles.push(existingRole ?? updatedRole);
            }),
        );

        return updatedRoles;
    }

    /**
     * Returns a partial user with just the updates
     * @param {UpdateUserCommand} command
     * @returns {User} with only the updated fields
     */
    private async updateLatestPartialUser(
        userFromDb: User,
        command: UpdateUserCommand,
    ): Promise<User> {
        command.firstName = command.firstName ?? userFromDb.firstName;
        command.lastName = command.lastName ?? userFromDb.lastName;

        // map command to a new user
        const user = this.mapper.map(command, User, UpdateUserCommand);

        user.emails = userFromDb.emails;
        if (command.email) {
            // update primary email
            user.emails = await this.updatePrimaryEmail(
                command.id,
                command.email,
                UPDATE_USER_MESSAGE,
            );
        }

        user.phones = userFromDb.phones;
        if (command.contactNumber) {
            // update primary phone
            user.phones = await this.updatePrimaryPhone(
                command.id,
                command.contactNumber,
                UPDATE_USER_MESSAGE,
            );
        }

        user.addresses = userFromDb.addresses;
        if (command.address1 || command.city || command.postalCode) {
            // update primary address
            const address = new Address(
                command.address1,
                command.address2,
                command.city,
                command.state,
                command.postalCode,
                UserContactType.Primary,
                'Y',
                UPDATE_USER_MESSAGE,
            );
            user.addresses = await this.updatePrimaryAddress(
                command.id,
                address,
            );
        }

        user.status = userFromDb.status;
        // update status
        if (command.status) {
            user.status = command.status;
        }

        return user;
    }

    /**
     * Performs partial update, retrieves the updated user, maps it and returns a profile dto
     * @param {UpdateUserCommand} command
     * @returns {UserProfileDto} updated user
     */
    async execute(command: UpdateUserCommand): Promise<UserProfileDto> {
        return this.userRepo
            .findOne(command.id)
            .then(async (user) => {
                return await this.updateLatestPartialUser(user, command);
            })
            .then(async (user: User) => {
                user.roles = await this.updateUserRoles(user.id, command.roles);
                return user;
            })
            .then(async (user: User) => {
                // save our updates
                await this.userRepo.save(user);
            })
            .then(async () => {
                const auditLogCommand = new CreateAuditLogCommand(
                    command.currentUser.userName,
                    AahTablesEnum.userPerson,
                    command.id,
                    UPDATE_USER_MESSAGE,
                    AuditLogEnum.Update,
                );
                await this.commandBus.execute(auditLogCommand);
            })
            .then(async () => {
                const updated = await this.userRepo.findOne(command.id);
                // convert back to DTO
                return await this.mapper.mapAsync(
                    updated,
                    UserProfileDto,
                    User,
                );
            })
            .catch((err: Error) => {
                this.logger.error(err.stack);
                switch (true) {
                    case err.message.includes(USERNAME_ALREADY_EXISTS_ERROR):
                        throw new UserNameAlreadyExistsException(
                            command.userName,
                        );
                    default:
                        throw new BadRequestException(COULD_NOT_UPDATE_USER);
                }
            });
    }
}
