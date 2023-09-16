import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { GroupTypeInfoReportController } from './group-type-info-report.controller';
import { GroupTypeInfoReportService } from './group-type-info-report.service';

describe('GroupTypeInfoReportController', () => {
    let controller: GroupTypeInfoReportController;
    const serviceMockValue = createMock<GroupTypeInfoReportService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: GroupTypeInfoReportService,
                    useValue: serviceMockValue,
                },
            ],
            controllers: [GroupTypeInfoReportController],
        }).compile();

        controller = module.get<GroupTypeInfoReportController>(
            GroupTypeInfoReportController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
