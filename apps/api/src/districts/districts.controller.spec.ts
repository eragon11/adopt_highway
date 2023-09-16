import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { District } from 'src/entities/district.entity';
import { repositoryMockValue } from 'src/utils/mocks/mock.repository';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';

describe('DistrictsController', () => {
    let controller: DistrictsController;
    const serviceMock = createMock<DistrictsService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DistrictsController],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: DistrictsService,
                    useValue: serviceMock,
                },
                {
                    provide: getRepositoryToken(District),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        controller = module.get<DistrictsController>(DistrictsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
