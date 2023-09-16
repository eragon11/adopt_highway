import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { PickupsController } from './pickups.controller';
import { PickupsService } from './pickups.service';
import { CommandBus } from '@nestjs/cqrs';

describe('PickupsController', () => {
    let controller: PickupsController;
    const serviceMockValue = createMock<PickupsService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PickupsController],
            providers: [
                {
                    provide: PickupsService,
                    useValue: serviceMockValue,
                },
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: CommandBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        controller = module.get<PickupsController>(PickupsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
