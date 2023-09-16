import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Segment } from 'src/entities/segment.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { SegmentReportService } from './segment-report.service';

describe('SegmentReportService', () => {
    let service: SegmentReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SegmentReportService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(Segment),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        service = module.get<SegmentReportService>(SegmentReportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
