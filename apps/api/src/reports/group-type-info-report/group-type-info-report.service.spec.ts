import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken } from '@nestjs/typeorm';
import { connectionMockValue } from 'src/utils/mocks/mock.repository';
import { GroupTypeInfoReportService } from './group-type-info-report.service';

describe('GroupTypeInfoReportService', () => {
    let service: GroupTypeInfoReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GroupTypeInfoReportService,
                {
                    provide: getConnectionToken(),
                    useValue: connectionMockValue,
                },
            ],
        }).compile();

        service = module.get<GroupTypeInfoReportService>(
            GroupTypeInfoReportService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
