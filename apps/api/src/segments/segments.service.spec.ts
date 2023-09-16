import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Segment } from 'src/entities/segment.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { SegmentsService } from './segments.service';

describe('SegmentsService', () => {
    let service: SegmentsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SegmentsService,
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

        service = module.get<SegmentsService>(SegmentsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
