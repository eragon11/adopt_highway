import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { AgreementReportController } from './agreement-report.controller';
import { AgreementReportService } from './agreement-report.service';

describe('AgreementReportController', () => {
    let controller: AgreementReportController;
    const serviceMockValue = createMock<AgreementReportService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: AgreementReportService,
                    useValue: serviceMockValue,
                },
            ],
            controllers: [AgreementReportController],
        }).compile();

        controller = module.get<AgreementReportController>(
            AgreementReportController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
