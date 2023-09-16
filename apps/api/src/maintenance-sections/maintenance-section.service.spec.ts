import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { MaintenanceSectionService } from './maintenance-section.service';

describe('MaintenanceSectionsService', () => {
    let service: MaintenanceSectionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MaintenanceSectionService,
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(MaintenanceSection),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        service = module.get<MaintenanceSectionService>(
            MaintenanceSectionService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
