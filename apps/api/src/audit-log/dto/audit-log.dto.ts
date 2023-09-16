import { AahTablesEnum, AuditLogEnum } from 'src/common/enum';

export class AuditLogDto {
    userName: string;
    tableName: AahTablesEnum;
    tableId: number;
    description: string;
    action: AuditLogEnum;
}
