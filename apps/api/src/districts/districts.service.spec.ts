import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { DistrictsService } from './districts.service';

describe('DistrictsService', () => {
    let service: DistrictsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DistrictsService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(District),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        service = module.get<DistrictsService>(DistrictsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
