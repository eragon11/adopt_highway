import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { mapperMockValue } from 'src/utils/mocks/mock.repository';
import { SegmentsController } from './segments.controller';
import { SegmentsService } from './segments.service';

describe('SegmentsController', () => {
    let controller: SegmentsController;
    const serviceMockValue = createMock<SegmentsService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SegmentsController],
            providers: [
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: SegmentsService,
                    useValue: serviceMockValue,
                },
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: QueryBus,
                    useValue: createMock<QueryBus>(),
                },
            ],
        }).compile();

        controller = module.get<SegmentsController>(SegmentsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
