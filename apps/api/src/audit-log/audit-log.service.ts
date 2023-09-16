import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { AahTablesEnum, AuditLogEnum } from 'src/common/enum';
import { AuditLog } from 'src/entities/auditLog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogService {
    constructor(
        @InjectRepository(AuditLog)
        private readonly repo: Repository<AuditLog>,
    ) {}

    async findAll(options: IPaginationOptions): Promise<Pagination<AuditLog>> {
        const items = await this.repo.createQueryBuilder('tl');
        return paginate<AuditLog>(items, options);
    }

    /**
     * Saves a new {AuditLog} entity
     * @param userName User who initiated the action
     * @param tableName Table where the action is being made
     * @param action {AuditLogEnum} action
     * @param description Description of the action
     */
    private async _save(
        userName: string,
        tableName: AahTablesEnum,
        tableId: number,
        description: string,
        action: AuditLogEnum,
    ) {
        const log: AuditLog = new AuditLog(
            userName,
            tableName,
            tableId,
            action,
            description,
        );
        await this.repo.save(log);
    }

    /**
     * Saves a new {AuditLog} entity with a CREATE action
     * @param userName User who initiated the action
     * @param tableName Table where the action is being made
     * @param tableId Table ID for the record in the action
     * @param action {AuditLogEnum} action
     * @param description Description of the action
     */
    async create(
        userName: string,
        tableName: AahTablesEnum,
        tableId: number,
        description: string,
        action: AuditLogEnum,
    ) {
        await this._save(userName, tableName, tableId, description, action);
    }
}
