import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Segment } from 'src/entities/segment.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { SegmentReportController } from './segment-report.controller';
import { SegmentReportService } from './segment-report.service';

describe('SegmentReportController', () => {
    let controller: SegmentReportController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SegmentReportController],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: SegmentReportService,
                    useValue: createMock<SegmentReportService>(),
                },
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

        controller = module.get<SegmentReportController>(
            SegmentReportController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
