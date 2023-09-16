import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
    NotImplementedException,
} from '@nestjs/common';
import {
    Brackets,
    FindOneOptions,
    Repository,
    SelectQueryBuilder,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { GetUserQuery, GetUsersQuery } from './queries/impl';
import { Roles, UserStatusEnum } from 'src/common/enum';
import {
    Address,
    County,
    District,
    Email,
    GroupSponsor,
    MaintenanceSection,
    Organization,
    Phone,
    Role,
} from 'src/entities';
import { UpdateUserCommand } from './commands/impl';
import { UserContactType } from 'src/entities/enums';
import {
    USERNAME_ALREADY_EXISTS_ERROR,
    COULD_NOT_CREATE_USER,
} from 'src/constants/common.constants';
import { UserNameAlreadyExistsException } from './exceptions';
import { Profile } from '@node-saml/passport-saml/lib';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectMapper() private mapper: Mapper,
    ) {}

    /**
     * Adds location based on role to params
     * @param {GetUsersQuery} params
     * @param {Role} role of the current user
     * @returns {GetUsersQuery} updated params
     */
    updateParamsWithUsersArea(
        params: GetUsersQuery,
        role: Role,
    ): GetUsersQuery {
        switch (role?.type) {
            case Roles.Administrator:
            case Roles.ReadOnlyUser:
                break;
            case Roles.DistrictCoordinator:
                params.districtNumber = role?.organization?.district?.number;
                break;
            case Roles.MaintenanceCoordinator:
                params.districtNumber =
                    role?.organization?.maintenanceSection?.district?.number;
                params.officeNumber =
                    role?.organization?.maintenanceSection?.number;
                break;
            default:
                throw new NotImplementedException(
                    `${role.type} has not been implemented`,
                );
                break;
        }
        return params;
    }

    /**
     *
     * @param {GetUsersQuery} params
     * @returns {SelectQueryBuilder} of all non-deleted, internal users
     */
    findAllNonDeletedInternalUsers(
        params: GetUsersQuery,
    ): SelectQueryBuilder<User> {
        if (!params.currentUser) {
        }

        const query = this.userRepo
            .createQueryBuilder('u')
            .leftJoinAndMapMany('u.roles', Role, 'r', 'u.USER_ID = r.USER_ID')
            .leftJoinAndMapOne(
                'r.organization',
                Organization,
                'o',
                'r.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'o.district',
                District,
                'd',
                'd.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'o.maintenanceSection',
                MaintenanceSection,
                'ms',
                'ms.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'ms.district',
                District,
                'dms',
                'ms.DISTRICT_ID = dms.DISTRICT_ID',
            )
            .leftJoinAndMapOne(
                'o.groupSponsor',
                GroupSponsor,
                'gs',
                'o.ORGANIZATION_ID = gs.ORGANIZATION_ID',
            )
            .leftJoinAndMapMany(
                'u.emails',
                Email,
                'em',
                'u.USER_ID = em.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.phones',
                Phone,
                'ph',
                'u.USER_ID = ph.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.addresses',
                Address,
                'ad',
                'u.USER_ID = ad.USER_ID',
            )
            .where('r.TYPE <> :volunteer', { volunteer: 'VOLUNTEER' }) // ONLY internal users
            .andWhere('gs.GROUP_ID IS NULL'); // ONLY internal users

        return query;
    }

    /**
     * Returns a SelectQueryBuilder object of type User filtered for non-deleted users that can be used in queries
     * @param {GetUsersQuery} params
     * @returns {SelectQueryBuilder<User>} of internal users fitting the params provided
     */
    findAllInternalUsers(params: GetUsersQuery): SelectQueryBuilder<User> {
        try {
            const query = this.findAllNonDeletedInternalUsers(params);

            // force criteria for non-admin users
            const role = params.currentUser?.currentRole;
            params = this.updateParamsWithUsersArea(params, role);

            // the following criteria are bracketed AND clauses
            query.andWhere(
                new Brackets((sqb) => {
                    // add USER_ID
                    if (params.userId) {
                        sqb.andWhere('u.USER_ID = :userId', {
                            userId: params.userId,
                        });
                    }

                    // add USERNAME
                    if (params.userName) {
                        sqb.andWhere('u.USERNAME = :userName', {
                            userName: params.userName,
                        });
                    }

                    // add district when role is valid
                    if (
                        params.districtNumber &&
                        [
                            Roles.Administrator.toString(),
                            Roles.DistrictCoordinator.toString(),
                        ].includes(role.type)
                    ) {
                        sqb.andWhere(
                            `EXISTS (SELECT osq.USER_ID FROM 
                            (SELECT dr.USER_ID, d.NUMBER
                            FROM aah.ORGANIZATION dorg
                            INNER JOIN aah.DISTRICT d ON dorg.ORGANIZATION_ID = d.ORGANIZATION_ID
                            INNER JOIN aah.ROLE dr ON dorg.ORGANIZATION_ID = dr.ORGANIZATION_ID
                            UNION
                            SELECT msr.USER_ID, ms.DISTRICT_NUMBER as NUMBER
                            FROM aah.ORGANIZATION msorg
                            INNER JOIN aah.MAINTENANCE_SECTION ms ON msorg.ORGANIZATION_ID = ms.ORGANIZATION_ID
                            INNER JOIN aah.ROLE msr ON msorg.ORGANIZATION_ID = msr.ORGANIZATION_ID) osq WHERE osq.NUMBER = :districtNumber AND osq.USER_ID = u.USER_ID)`,
                            { districtNumber: params.districtNumber },
                        );
                    }

                    // add office number when role is valid
                    if (
                        params.officeNumber &&
                        [
                            Roles.Administrator.toString(),
                            Roles.DistrictCoordinator.toString(),
                            Roles.MaintenanceCoordinator.toString(),
                        ].includes(role.type)
                    ) {
                        sqb.andWhere(
                            `EXISTS (SELECT msr1.USER_ID, ms1.NUMBER AS NUMBER, ms1.DISTRICT_NUMBER
                            FROM aah.ORGANIZATION msorg1
                            INNER JOIN aah.MAINTENANCE_SECTION ms1 ON msorg1.ORGANIZATION_ID = ms1.ORGANIZATION_ID
                            INNER JOIN aah.ROLE msr1 ON msorg1.ORGANIZATION_ID = msr1.ORGANIZATION_ID
                            WHERE 
                            ms1.NUMBER = :officeNumber 
                            AND ms1.DISTRICT_NUMBER = :districtNumber
                            AND msr1.USER_ID = u.USER_ID)`,
                            {
                                officeNumber: params.officeNumber,
                                districtNumber: params.districtNumber,
                            },
                        );
                    }

                    // add name search
                    if (params.fullNameContains) {
                        sqb.andWhere(
                            "u.FULL_NAME LIKE '%' + :searchText + '%'",
                            {
                                searchText: params.fullNameContains,
                            },
                        );
                    }

                    // add name search
                    if (params.lastNameStartsWith) {
                        sqb.andWhere(
                            "u.LAST_NAME LIKE :lastNameStartsWith + '%'",
                            {
                                lastNameStartsWith: params.lastNameStartsWith,
                            },
                        );
                    }
                }),
            );

            // the following criteria are bracketed OR clauses
            const countOfRoleParams = [
                params.includeAdministratorRoles,
                params.includeDistrictCoordinatorRoles,
                params.includeMaintenanceCoordinatorRoles,
                params.includeApproverRoles,
                params.includeSupportCoordinatorRoles,
            ].filter(Boolean).length;

            let firstOr = true;

            if (countOfRoleParams > 0) {
                query.andWhere(
                    new Brackets((sqb) => {
                        if (params.includeAdministratorRoles) {
                            if (firstOr) {
                                sqb.where(
                                    `EXISTS(SELECT * FROM aah.ROLE r1 WHERE r1.TYPE = :admin AND u.USER_ID = r1.USER_ID)`,
                                    {
                                        admin: Roles.Administrator,
                                    },
                                );
                            } else {
                                sqb.orWhere(
                                    `EXISTS(SELECT * FROM aah.ROLE r1 WHERE r1.TYPE = :admin AND u.USER_ID = r1.USER_ID)`,
                                    {
                                        admin: Roles.Administrator,
                                    },
                                );
                            }
                            firstOr = false;
                        }

                        if (params.includeDistrictCoordinatorRoles) {
                            if (firstOr) {
                                sqb.where(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :dc AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        dc: Roles.DistrictCoordinator,
                                    },
                                );
                            } else {
                                sqb.orWhere(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :dc AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        dc: Roles.DistrictCoordinator,
                                    },
                                );
                            }
                            firstOr = false;
                        }

                        if (params.includeMaintenanceCoordinatorRoles) {
                            if (firstOr) {
                                sqb.where(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :mc AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        mc: Roles.MaintenanceCoordinator,
                                    },
                                );
                            } else {
                                sqb.orWhere(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :mc AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        mc: Roles.MaintenanceCoordinator,
                                    },
                                );
                            }
                            firstOr = false;
                        }

                        if (params.includeApproverRoles) {
                            if (firstOr) {
                                sqb.where(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :app AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        app: Roles.Approver,
                                    },
                                );
                            } else {
                                sqb.orWhere(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :app AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        app: Roles.Approver,
                                    },
                                );
                            }
                            firstOr = false;
                        }

                        if (params.includeSupportCoordinatorRoles) {
                            if (firstOr) {
                                sqb.where(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :supp AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        supp: Roles.SupportTeam,
                                    },
                                );
                            } else {
                                sqb.orWhere(
                                    `EXISTS(SELECT * FROM aah.ROLE r2 WHERE r2.TYPE = :supp AND u.USER_ID = r2.USER_ID)`,
                                    {
                                        supp: Roles.SupportTeam,
                                    },
                                );
                            }
                            firstOr = false;
                        }
                    }),
                );
            }
            // the following criteria are bracketed OR clauses
            const countOfStatusParams = [
                params.includeActiveUsers,
                params.includeInactiveUsers,
            ].filter(Boolean).length;

            if (countOfStatusParams > 0) {
                query.andWhere(
                    new Brackets((sqb) => {
                        if (params.includeActiveUsers) {
                            if (firstOr) {
                                sqb.where('u.STATUS = :active', {
                                    active: UserStatusEnum.Active,
                                });
                            } else {
                                sqb.orWhere('u.STATUS = :active', {
                                    active: UserStatusEnum.Active,
                                });
                            }
                            firstOr = false;
                        }
                        if (params.includeInactiveUsers) {
                            if (firstOr) {
                                sqb.where('u.STATUS = :inactive', {
                                    inactive: UserStatusEnum.Inactive,
                                });
                            } else {
                                sqb.orWhere('u.STATUS = :inactive', {
                                    inactive: UserStatusEnum.Inactive,
                                });
                            }
                            firstOr = false;
                        }
                    }),
                );
            }
            return query;
        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }

    /**
     *
     * @param options
     * @returns
     */
    async findOne(options?: FindOneOptions<User>): Promise<User> {
        const user = await this.userRepo.findOne(options);

        if (user) {
            return user;
        }
    }

    /**
     * Returns all active users matching this login
     * @param profile
     * @returns {User} is
     */
    async findByLogin(profile: Profile): Promise<User | undefined> {
        const params = new GetUsersQuery();
        params.userName = profile.nameID;
        const user = await this.userRepo.findOne({ userName: profile.nameID });

        if (user) {
            return user;
        }
    }

    /**
     *
     * @param {GetUserQuery} getUserQuery
     * @returns {User} with the matching ID if the user falls within the current user's area
     */
    async findByUserId(getUserQuery: GetUserQuery): Promise<User> {
        let getUsersQuery: GetUsersQuery = new GetUsersQuery();
        getUsersQuery.userId = getUserQuery.userId;
        getUsersQuery.currentUser = getUserQuery.user;
        getUsersQuery = this.updateParamsWithUsersArea(
            getUsersQuery,
            getUserQuery.user.currentRole,
        );
        const query = this.findAllInternalUsers(getUsersQuery);
        const user = await query.getOne();
        return user;
    }

    /**
     * Returns the user that matches the id provided
     * @param id id for the user
     * @returns {User} entity
     */
    async getById(id: number): Promise<User | undefined> {
        // locate non-deleted active users
        const user = await this.userRepo.findOne({
            id: id,
            status: UserStatusEnum.Active,
        });

        if (user) {
            return user;
        }
    }

    async update(command: UpdateUserCommand): Promise<void> {
        let emails: Array<Email>;
        if (command.email) {
            const email = new Email();
            email.value = command.email;
            email.type = UserContactType.Primary;
            email.userId = command.id;
            email.comment = 'User updated';
            emails = [email];
        }

        await this.userRepo.save({
            id: command.id,
            userName: command.userName,
            firstName: command.firstName,
            lastName: command.lastName,
            status: command.status,
            emails: emails,
        });

        return;
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        try {
            const user = await this.getById(userId);

            const isRefreshTokenMatching = await bcrypt.compare(
                refreshToken,
                user.currentHashedRefreshToken,
            );

            if (isRefreshTokenMatching) {
                return user;
            }
        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken: string = await bcrypt.hash(
            refreshToken,
            10,
        );
        await this.userRepo.update(userId, {
            currentHashedRefreshToken: currentHashedRefreshToken,
            lastLogin: new Date(),
        });
    }

    async removeRefreshToken(userId: number) {
        this.logger.debug(`Removing refresh token for userId; ${userId}`);
        return this.userRepo.update(userId, {
            currentHashedRefreshToken: null,
        });
    }

    convertToDto(user: User) {
        return this.mapper.map(user, UserDto, User);
    }

    /**
     * Returns the first active, district coordinator with an email
     * @param districtNumber
     * @returns {User} who is the active district coordinator
     */
    async findDistrictCoordinatorByDistrictNumber(
        districtNumber: number,
    ): Promise<User> {
        const query = await this.userRepo
            .createQueryBuilder('u')
            .leftJoinAndMapMany('u.roles', Role, 'r', 'u.USER_ID = r.USER_ID')
            .leftJoinAndMapOne(
                'r.organization',
                Organization,
                'o',
                'r.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'o.district',
                District,
                'd',
                'd.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapMany(
                'u.emails',
                Email,
                'em',
                'u.USER_ID = em.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.phones',
                Phone,
                'ph',
                'u.USER_ID = ph.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.addresses',
                Address,
                'ad',
                'u.USER_ID = ad.USER_ID',
            )
            .where('d.NUMBER = :districtNumber', { districtNumber })
            .andWhere('em.value IS NOT NULL')
            .andWhere('u.STATUS = :userStatus', {
                userStatus: UserStatusEnum.Active,
            })
            .andWhere('r.TYPE = :roleType', {
                roleType: Roles.DistrictCoordinator,
            })
            .take(1)
            .getMany();

        return query[0];
    }

    async findDistrictCoordinatorsByCountyNumber(
        countyNumber: number,
    ): Promise<User[]> {
        const query = await this.userRepo
            .createQueryBuilder('u')
            .leftJoinAndMapMany('u.roles', Role, 'r', 'u.USER_ID = r.USER_ID')
            .leftJoinAndMapOne(
                'r.organization',
                Organization,
                'o',
                'r.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'o.district',
                District,
                'd',
                'd.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoin('COUNTY_DISTRICT', 'dc', 'dc.DISTRICT_ID = d.DISTRICT_ID')
            .leftJoinAndMapOne(
                'c.county',
                County,
                'c',
                'dc.COUNTY_ID = c.COUNTY_ID',
            )
            .leftJoinAndMapMany(
                'u.emails',
                Email,
                'em',
                'u.USER_ID = em.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.phones',
                Phone,
                'ph',
                'u.USER_ID = ph.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.addresses',
                Address,
                'ad',
                'u.USER_ID = ad.USER_ID',
            )
            .where('c.NUMBER = :countyNumber', { countyNumber: countyNumber })
            .andWhere('em.value IS NOT NULL')
            .andWhere('u.STATUS = :userStatus', {
                userStatus: UserStatusEnum.Active,
            })
            .andWhere('r.TYPE = :roleType', {
                roleType: Roles.DistrictCoordinator,
            })
            .getMany();

        return query;
    }

    async findMaintenanceCoordinatorsForDistrictAndOffice(
        districtNumber: number,
        officeNumber: number,
    ): Promise<User[]> {
        const query = await this.userRepo
            .createQueryBuilder('u')
            .leftJoinAndMapMany('u.roles', Role, 'r', 'u.USER_ID = r.USER_ID')
            .leftJoinAndMapOne(
                'r.organization',
                Organization,
                'o',
                'r.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapOne(
                'o.district',
                MaintenanceSection,
                'ms',
                'ms.ORGANIZATION_ID = o.ORGANIZATION_ID',
            )
            .leftJoinAndMapMany(
                'u.emails',
                Email,
                'em',
                'u.USER_ID = em.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.phones',
                Phone,
                'ph',
                'u.USER_ID = ph.USER_ID',
            )
            .leftJoinAndMapMany(
                'u.addresses',
                Address,
                'ad',
                'u.USER_ID = ad.USER_ID',
            )
            .where(
                'ms.DISTRICT_NUMBER = :districtNumber AND ms.NUMBER = :officeNumber',
                { districtNumber, officeNumber },
            )
            .andWhere('em.value IS NOT NULL')
            .andWhere('u.STATUS = :userStatus', {
                userStatus: UserStatusEnum.Active,
            })
            .andWhere('r.TYPE = :roleType', {
                roleType: Roles.MaintenanceCoordinator,
            })
            .getMany();

        return query;
    }

    /**
     * Creates and returns a new User
     * @param {string} userName
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} status
     * @returns {User} newly created user
     */
    async createNewUser(
        userName: string,
        firstName: string,
        lastName: string,
        status: UserStatusEnum,
    ) {
        const createUser = new User(userName, firstName, lastName, status);
        const saveUser = await this.userRepo
            .save(createUser)
            .catch((error: Error) => {
                this.logger.error(error);
                switch (true) {
                    case error.message.includes(USERNAME_ALREADY_EXISTS_ERROR):
                        throw new UserNameAlreadyExistsException(userName);
                    default:
                        throw new BadRequestException(COULD_NOT_CREATE_USER);
                }
            });
        return saveUser;
    }

    /**
     * Retrieves a user with the matching userName
     * @param {string} userName
     * @returns {User} user matching the userName provided
     */
    async getByUsername(userName: string): Promise<User> {
        return this.userRepo.findOne({ where: { userName } }).catch((err) => {
            this.logger.error(err);
            throw new InternalServerErrorException(
                'Could not retrieve user by user name',
            );
        });
    }
}
