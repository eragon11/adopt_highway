import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/auditLog.entity';
import { AuditLogService } from './audit-log.service';
import { AuditLogController } from './audit-log.controller';
import { AuditLogCommandHandlers } from './commands/handlers';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([AuditLog])],
    providers: [AuditLogService, ...AuditLogCommandHandlers],
    controllers: [AuditLogController],
    exports: [AuditLogService, ...AuditLogCommandHandlers],
})
export class AuditLogModule {}
