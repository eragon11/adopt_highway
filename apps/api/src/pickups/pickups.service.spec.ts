import { getMapperToken } from '@automapper/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pickup } from 'src/entities/pickup.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { PickupsService } from './pickups.service';

describe('PickupsService', () => {
    let service: PickupsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PickupsService,
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

        service = module.get<PickupsService>(PickupsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
