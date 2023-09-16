import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agreement } from 'src/entities/agreement.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { AgreementsByRenewalDateReportService } from './agreements-by-renewal-date-report.service';

describe('AgreementsByRenewalDateReportService', () => {
    let service: AgreementsByRenewalDateReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AgreementsByRenewalDateReportService,
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

        service = module.get<AgreementsByRenewalDateReportService>(
            AgreementsByRenewalDateReportService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
