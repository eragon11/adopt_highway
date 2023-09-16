import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agreement } from 'src/entities/agreement.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { GroupReportService } from './group-report.service';

describe('GroupReportService', () => {
    let service: GroupReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupReportService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(Agreement),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        service = module.get<GroupReportService>(GroupReportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
