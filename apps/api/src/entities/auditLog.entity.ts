import { AutoMap } from '@automapper/classes';
import { IsDate, IsInt, IsNotEmpty } from 'class-validator';
import { AuditLogEnum } from 'src/common/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * Entity for logging CRUD events in AAH
 */
@Entity({ name: 'AUDIT_LOG', schema: process.env.DB_SCHEMA })
export class AuditLog {
    /**
     *
     */
    constructor(
        userName: string,
        tableName: string,
        tableId: number,
        action: AuditLogEnum,
        description: string,
    ) {
        this.userName = userName;
        this.tableName = tableName;
        this.tableId = tableId;
        this.action = action;
        this.description = description;
        this.date = new Date();
    }

    @IsInt()
    @PrimaryGeneratedColumn('increment', { name: 'LOG_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @IsNotEmpty()
    @Column({ name: 'USERNAME' })
    @AutoMap()
    userName: string;

    @IsDate()
    @IsNotEmpty()
    @Column({ name: 'DATE' })
    @AutoMap()
    date: Date;

    @IsNotEmpty()
    @Column({ name: 'TABLE_NAME' })
    @AutoMap()
    tableName: string;

    @IsNotEmpty()
    @Column({ name: 'TABLE_ID' })
    @AutoMap()
    tableId: number;

    @IsNotEmpty({})
    @Column({ name: 'ACTION' })
    @AutoMap()
    action: AuditLogEnum;

    @Column({ name: 'DESCRIPTION' })
    @AutoMap()
    description: string;
}
