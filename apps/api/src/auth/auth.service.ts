import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
    BadRequestException,
    ForbiddenException,
    Global,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { Role } from 'src/entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RequestWithUser from './interfaces/requestWithUser.interface';
import {
    INVALID_ROLE_ID,
    NO_ROLE_FOR_USER,
    USER_IS_INACTIVE,
    USER_NOT_REGISTERED,
} from 'src/constants/common.constants';
import { Config, Roles } from 'src/common/enum';
import TokenPayload from './interfaces/tokenPayload.interface';
import { Profile } from '@node-saml/passport-saml/lib';

@Global()
@Injectable()
export class AuthService {
    constructor(
        private readonly logger: Logger,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        @InjectMapper() private mapper: Mapper,
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) {}

    async validateUser(profile: Profile): Promise<User> {
        try {
            this.logger.debug('Validate the user', 'AuthService');
            const user = await this.userService.findByLogin(profile);
            if (!user) {
                throw new UnauthorizedException(USER_NOT_REGISTERED);
            }
            return user;
        } catch (err) {
            this.logger.error('Could not validate the user');
            throw err;
        }
    }

    public getCookieWithJwtAccessToken(
        user: User,
        roleId?: number,
        samlIssuer?: string,
    ) {
        try {
            // assign the user
            if (user.roles.length === 1) {
                roleId = user.roles[0].id;
            }

            if (
                roleId !== 0 &&
                !user.roles.some((role) => role.id === roleId)
            ) {
                throw new UnauthorizedException(INVALID_ROLE_ID);
            }

            const userDto = this.mapper.map(user, UserDto, User);

            const payload: TokenPayload = {
                iss: samlIssuer ?? this.configService.get(Config.SAML_ISSUER),
                sub: userDto.id,
                selectedRole: roleId,
                userName: userDto.userName,
                roles: userDto.roles,
            };

            const token = this.jwtService.sign(payload, {
                secret: this.configService.get(Config.JWT_ACCESS_TOKEN_SECRET),
                expiresIn: `${this.configService.get(
                    Config.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
                )}`,
            });

            return `Authentication=${token}; Secure; HttpOnly; Path=/; Max-Age=${this.configService.get(
                'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
            )}`;
        } catch (err) {
            this.logger.error('Could not get access token');
            throw err;
        }
    }

    public getRoleIdFromCookie(cookie: string) {
        const decoded: any = this.jwtService.decode(cookie, {
            json: true,
            complete: true,
        });

        const payload = decoded.payload as TokenPayload;

        return payload.selectedRole;
    }

    public async getCookieWithJwtRefreshToken(
        userId: number,
        roleId: number,
        samlIssuer?: string,
    ): Promise<any | unknown> {
        try {
            const user = await this.userService.getById(userId);

            // if no user, it is because they are inactive
            if (!user) {
                throw new ForbiddenException(USER_IS_INACTIVE);
            }

            // assign the user
            if (user?.roles.length === 1) {
                roleId = user?.roles[0].id;
            }

            if (
                roleId !== 0 &&
                !user?.roles.some((role) => role.id === roleId)
            ) {
                throw new UnauthorizedException(INVALID_ROLE_ID);
            }

            const userDto = this.mapper.map(user, UserDto, User);
            const payload: TokenPayload = {
                iss: samlIssuer ?? this.configService.get(Config.SAML_ISSUER),
                sub: userDto.id,
                selectedRole: roleId,
                userName: userDto.userName,
                roles: userDto.roles,
            };
            const token = this.jwtService.sign(payload, {
                secret: this.configService.get(Config.JWT_REFRESH_TOKEN_SECRET),
                expiresIn: `${this.configService.get(
                    Config.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                )}`,
            });

            const cookie = `Refresh=${token};Secure; HttpOnly; Path=/; Max-Age=${this.configService.get(
                Config.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
            )}`;

            return {
                cookie,
                token,
            };
        } catch (err) {
            this.logger.error('Could not create refresh token');
        }
    }

    // returns null for multiple users who have not selected a role
    public getSelectedRoleId(user: User, cookie: string) {
        try {
            let selectedRoleId: number = null;

            // single role users will return first role
            if (user && user?.roles && user.roles.length === 1) {
                selectedRoleId = user?.roles[0].id;
            } else {
                // multi role users will return from their authentication cookie
                const r = this.getRoleIdFromCookie(cookie);
                selectedRoleId = r == 0 ? null : r;
            }
            return selectedRoleId;
        } catch (err) {
            this.logger.error(`Could not get the selected role`);
            throw err;
        }
    }

    public getCookiesForLogOut(): any {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0',
        ];
    }

    /**
     * Returns the selected role from the authentication
     * @param req Request object
     * @returns a {Role} object
     */
    public async GetSelectedRole(req: RequestWithUser): Promise<Role> {
        try {
            const selectedRoleId = this.getSelectedRoleId(
                req.user,
                req.cookies['Authentication'],
            );
            if (selectedRoleId) {
                return await this.roleRepository.findOne(selectedRoleId);
            }

            return null;
        } catch (error) {
            this.logger.error('Could not get selected role');
            throw new BadRequestException(NO_ROLE_FOR_USER);
        }
    }

    public getLoginRedirect(user: User) {
        let redirectUrl = this.configService.get(
            Config.SAML_AAH_LOGIN_FAILURE_URL,
        );
        try {
            if (!user || user.roles?.length === 0) {
                return redirectUrl;
            }
            const roleCount = user?.roles?.length;

            const hasVolunteer = user?.roles
                .map((role: Role) => role.type)
                .includes(Roles.Volunteer);

            const isVolunteer = roleCount === 1 && hasVolunteer;

            redirectUrl = isVolunteer
                ? this.configService.get(Config.SAML_VOLUNTEER_SUCCESS_URL)
                : this.configService.get(Config.SAML_AAH_LOGIN_SUCCESS_URL);
            return redirectUrl;
        } catch (err) {
            this.logger.error('Could not set the redirect URL');
            return this.configService.get(Config.SERVER_ERROR_PAGE);
        }
    }
}
