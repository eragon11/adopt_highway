import { createMock } from '@golevelup/nestjs-testing';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PingUsersService } from './ping-users.service';

describe('PingUsersService', () => {
    let service: PingUsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PingUsersService,
                {
                    provide: ConfigService,
                    useValue: createMock<ConfigService>(),
                },
                {
                    provide: CommandBus,
                    useValue: createMock<CommandBus>(),
                },
            ],
        }).compile();

        service = module.get<PingUsersService>(PingUsersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
