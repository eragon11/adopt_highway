import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { County } from 'src/entities/county.entity';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { CountiesService } from './counties.service';

describe('CountiesService', () => {
    let service: CountiesService;
    const serviceMockValue = createMock<AuthService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: serviceMockValue,
                },
                CountiesService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(County),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        service = module.get<CountiesService>(CountiesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
