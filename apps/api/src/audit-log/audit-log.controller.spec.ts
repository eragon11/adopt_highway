import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/auth/auth.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLogService } from './audit-log.service';

describe('AuditLogController', () => {
    let controller: AuditLogController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: AuthService,
                    useValue: createMock<AuthService>(),
                },
                {
                    provide: AuditLogService,
                    useValue: createMock<AuditLogService>(),
                },
            ],
            controllers: [AuditLogController],
        }).compile();

        controller = module.get<AuditLogController>(AuditLogController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
