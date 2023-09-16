import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuditLogService } from 'src/audit-log/audit-log.service';
import { CreateAuditLogCommand } from '../audit-log.created';

/**
 * Handle the create audit log command
 */
@CommandHandler(CreateAuditLogCommand)
export class CreateAuditLogHandler
    implements ICommandHandler<CreateAuditLogCommand>
{
    constructor(private readonly logService: AuditLogService) {}
    async execute(command: CreateAuditLogCommand): Promise<void> {
        Logger.debug(
            `Audit Log created - ${JSON.stringify(command)}`,
            'CreateAuditLogCommand',
        );
        await this.logService.create(
            command.editingUserName,
            command.tableName,
            command.tableId,
            command.description,
            command.action,
        );
        return;
    }
}
