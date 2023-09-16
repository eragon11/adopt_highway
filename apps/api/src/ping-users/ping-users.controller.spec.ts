import { createMock } from '@golevelup/nestjs-testing';
import { ConfigService } from '@nestjs/config';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { PingUsersController } from './ping-users.controller';
import { PingUsersService } from './ping-users.service';

describe('PingUsersController', () => {
    let controller: PingUsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PingUsersController],
            providers: [
                {
                    provide: CommandBus,
                    useValue: createMock<CommandBus>(),
                },
                {
                    provide: QueryBus,
                    useValue: createMock<QueryBus>(),
                },
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: PingUsersService,
                    useValue: createMock<PingUsersService>(),
                },
                {
                    provide: ConfigService,
                    useValue: createMock<ConfigService>(),
                },
            ],
        }).compile();

        controller = module.get<PingUsersController>(PingUsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
