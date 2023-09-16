/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { User } from '../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { Role } from 'src/entities/role.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { createMock } from '@golevelup/nestjs-testing';
import { Config, Roles, UserStatusEnum } from 'src/common';
import { Organization } from 'src/entities';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { Profile } from '@node-saml/passport-saml/lib';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let logger: Logger;

    const authenticatedUserProfile: Profile = {
        nameID: 'test@txdot.gov',
        nameIDFormat: 'test',
        issuer: 'test',
    };

    const authenticatedUser = new User(
        'test@txdot.gov',
        'Test',
        'User1',
        UserStatusEnum.Active,
    );

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            switch (key) {
                                case Config.SAML_VOLUNTEER_SUCCESS_URL:
                                    return Config.SAML_VOLUNTEER_SUCCESS_URL;
                                case Config.SAML_AAH_LOGIN_FAILURE_URL:
                                    return Config.SAML_AAH_LOGIN_FAILURE_URL;
                                case Config.SERVER_ERROR_PAGE:
                                    return Config.SERVER_ERROR_PAGE;
                                default:
                                    break;
                            }
                            return null;
                        }),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: {},
                },
                {
                    provide: getRepositoryToken(Role),
                    useValue: {},
                },
                {
                    provide: 'automapper:nestjs:default',
                    useValue: {},
                },
                {
                    provide: EventEmitter2,
                    useValue: createMock<EventEmitter2>(),
                },
                {
                    provide: Logger,
                    useValue: {
                        log: jest.fn(),
                        debug: jest.fn(),
                        error: jest.fn(),
                    },
                },
            ],
        }).compile();

        AutomapperModule.forRoot({
            options: [{ name: 'aah', pluginInitializer: classes }],
            singular: true,
        });
        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
        logger = module.get<Logger>(Logger);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return access-denied if the user has no roles', () => {
        const user = new User(
            'text@txdot.gov',
            'Test',
            'User1',
            UserStatusEnum.Active,
        );
        expect(service.getLoginRedirect(user)).toBe(Config.SERVER_ERROR_PAGE);
    });

    it('should return access-denied if there is no user', () => {
        expect(service.getLoginRedirect(null)).toBe(
            Config.SAML_AAH_LOGIN_FAILURE_URL,
        );
    });

    it('should return the volunteer URL if the user is a volunteer', () => {
        const user = new User(
            'text@txdot.gov',
            'Test',
            'User1',
            UserStatusEnum.Active,
        );
        const volunteer = new Role();
        volunteer.user = user;
        volunteer.type = Roles.Volunteer;
        volunteer.organization = new Organization();
        user.roles = [volunteer];
        expect(service.getLoginRedirect(user)).toBe(
            Config.SAML_VOLUNTEER_SUCCESS_URL,
        );
    });

    it('should validate the user', async () => {
        const spyFindOne = jest.spyOn(userService, 'findByLogin');
        spyFindOne.mockResolvedValue(authenticatedUser);
        expect(await service.validateUser(authenticatedUserProfile)).toBe(
            authenticatedUser,
        );
    });

    it('should throw unauthorized when there is no user', async () => {
        jest.spyOn(userService, 'findByLogin').mockResolvedValue(null);
        return expect(async () => {
            await service.validateUser(authenticatedUserProfile);
        }).rejects.toThrow(UnauthorizedException);
    });
});
