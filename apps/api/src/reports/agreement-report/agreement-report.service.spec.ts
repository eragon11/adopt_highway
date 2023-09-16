import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agreement } from 'src/entities/agreement.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { AgreementReportService } from './agreement-report.service';

describe('AgreementReportService', () => {
    let service: AgreementReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AgreementReportService,
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

        service = module.get<AgreementReportService>(AgreementReportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
