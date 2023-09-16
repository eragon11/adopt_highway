import { createMock } from '@golevelup/nestjs-testing';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/auditLog.entity';
import { repositoryMockValue } from 'src/utils/mocks/mock.repository';
import { AuditLogService } from './audit-log.service';

describe('AuditLogService', () => {
    let service: AuditLogService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: getRepositoryToken(AuditLog),
                    useValue: repositoryMockValue,
                },
                {
                    provide: AuditLogService,
                    useValue: createMock<AuditLogService>(),
                },
            ],
        }).compile();

        service = module.get<AuditLogService>(AuditLogService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
