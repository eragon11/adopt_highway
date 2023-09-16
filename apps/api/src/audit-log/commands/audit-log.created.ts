import { AahTablesEnum, AuditLogEnum } from 'src/common/enum';

/**
 * Command for creating an audit log record
 */
export class CreateAuditLogCommand {
    editingUserName: string;
    tableId: number;
    description: string;
    tableName: AahTablesEnum;
    action: AuditLogEnum;

    constructor(
        editingUserName: string,
        tableName: AahTablesEnum,
        tableId: number,
        description: string,
        action: AuditLogEnum,
    ) {
        this.editingUserName = editingUserName;
        this.tableId = tableId;
        this.description = description;
        this.tableName = tableName;
        this.action = action;
    }
}
