import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { GetUserPipe } from 'src/decorators/user-with-current-role.decorator';
import { County } from 'src/entities/county.entity';
import { repositoryMockValue } from 'src/utils/mocks/mock.repository';
import { CountyController } from './counties.controller';
import { CountiesService } from './counties.service';

describe('CountiesController', () => {
    let controller: CountyController;
    const serviceMock = createMock<CountiesService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CountyController],
            providers: [
                {
                    provide: GetUserPipe,
                    useValue: createMock<GetUserPipe>(),
                },
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: CountiesService,
                    useValue: serviceMock,
                },
                {
                    provide: getRepositoryToken(County),
                    useValue: repositoryMockValue,
                },
            ],
        }).compile();

        controller = module.get<CountyController>(CountyController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
