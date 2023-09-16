import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pickup } from 'src/entities/pickup.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { PickupReportService } from './pickup-report.service';

describe('PickupReportService', () => {
    let service: PickupReportService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PickupReportService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(Pickup),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        service = module.get<PickupReportService>(PickupReportService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
