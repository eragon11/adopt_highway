import { getMapperToken } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { createMock } from '@golevelup/nestjs-testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { NotFoundInterceptor } from 'src/interceptors/not-found.interceptor';
import { UsersController } from './users.controller';
import { UserService } from './users.service';

describe('UsersController', () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: NotFoundInterceptor,
                    useValue: createMock<NotFoundInterceptor>(),
                },
                {
                    provide: QueryBus,
                    useValue: createMock<QueryBus>(),
                },
                {
                    provide: CommandBus,
                    useValue: createMock<CommandBus>(),
                },
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: UserService,
                    useValue: createMock<UserService>(),
                },
                {
                    provide: getMapperToken(),
                    useValue: createMock<Mapper>(),
                },
            ],
            controllers: [UsersController],
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
