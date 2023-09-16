import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { District } from 'src/entities/district.entity';
import { repositoryMockValue } from 'src/utils/mocks/mock.repository';
import { MaintenanceSectionController as MaintenanceSectionsController } from './maintenance-section.controller';
import { MaintenanceSectionService as MaintenanceSectionsService } from './maintenance-section.service';

describe('MaintenanceSectionsController', () => {
    let controller: MaintenanceSectionsController;
    const serviceMock = createMock<MaintenanceSectionsService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MaintenanceSectionsController],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: MaintenanceSectionsService,
                    useValue: serviceMock,
                },
                {
                    provide: getRepositoryToken(District),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        controller = module.get<MaintenanceSectionsController>(
            MaintenanceSectionsController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
