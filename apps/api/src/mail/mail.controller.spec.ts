import { Mapper } from '@automapper/core';
import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { MailerService } from '@nestjs-modules/mailer';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';

describe('MailController', () => {
    let controller: MailController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MailController],
            providers: [
                MailService,
                {
                    provide: MailerService,
                    useValue: createMock<MailerService>(),
                },
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
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
                    provide: getMapperToken(),
                    useValue: createMock<Mapper>(),
                },
            ],
        }).compile();

        controller = module.get<MailController>(MailController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
