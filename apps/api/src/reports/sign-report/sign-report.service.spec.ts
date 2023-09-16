import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sign } from 'src/entities/sign.entity';
import { repositoryMockValue } from 'src/utils/mocks/mock.repository';
import { SignReportService } from './sign-report.service';

describe('SignStatusReportService', () => {
    let service: SignReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(Sign),
                    useValue: repositoryMockValue,
                },
                {
                    provide: SignReportService,
                    useValue: createMock<SignReportService>(),
                },
            ],
        }).compile();

        service = module.get<SignReportService>(SignReportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
