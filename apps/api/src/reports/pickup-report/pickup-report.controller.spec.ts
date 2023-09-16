import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Pickup } from 'src/entities/pickup.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { PickupReportController } from './pickup-report.controller';
import { PickupReportService } from './pickup-report.service';

describe('PickupReportController', () => {
    let controller: PickupReportController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PickupReportController],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: PickupReportService,
                    useValue: createMock<PickupReportService>(),
                },
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(Pickup),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        controller = module.get<PickupReportController>(PickupReportController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
