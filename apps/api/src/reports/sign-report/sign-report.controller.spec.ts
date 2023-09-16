import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { SignReportController } from './sign-report.controller';
import { SignReportService } from './sign-report.service';

describe('SignStatusReportController', () => {
    let controller: SignReportController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: SignReportService,
                    useValue: createMock<SignReportService>(),
                },
            ],
            controllers: [SignReportController],
        }).compile();

        controller = module.get<SignReportController>(SignReportController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
