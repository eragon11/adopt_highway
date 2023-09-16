import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { AgreementsByRenewalDateReportController } from './agreements-by-renewal-date-report.controller';
import { AgreementsByRenewalDateReportService } from './agreements-by-renewal-date-report.service';

describe('AgreementsByRenewalDateReportController', () => {
    let controller: AgreementsByRenewalDateReportController;
    const serviceMockValue = createMock<AgreementsByRenewalDateReportService>();

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AgreementsByRenewalDateReportController],
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: AgreementsByRenewalDateReportService,
                    useValue: serviceMockValue,
                },
            ],
        }).compile();

        controller = module.get<AgreementsByRenewalDateReportController>(
            AgreementsByRenewalDateReportController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
