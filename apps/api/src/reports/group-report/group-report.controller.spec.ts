import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { GroupReportController } from './group-report.controller';
import { GroupReportService } from './group-report.service';

describe('GroupReportController', () => {
    let controller: GroupReportController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: GroupReportService,
                    useValue: createMock<GroupReportService>(),
                },
            ],
            controllers: [GroupReportController],
        }).compile();

        controller = module.get<GroupReportController>(GroupReportController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
