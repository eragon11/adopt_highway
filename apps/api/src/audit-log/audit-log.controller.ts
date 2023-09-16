import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Query,
    UseGuards,
} from '@nestjs/common';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { CAN_VIEW_AUDIT_LOG } from 'src/common/permissions';
import { PaginationDto } from 'src/utils/pagination.utils';
import { AuditLogService } from './audit-log.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('audit-log')
export class AuditLogController {
    constructor(private readonly service: AuditLogService) {}

    @HttpCode(HttpStatus.OK)
    @Get('')
    @UseGuards(RoleGuard([...CAN_VIEW_AUDIT_LOG]))
    async index(@Query() options: PaginationDto) {
        return await this.service.findAll(options);
    }
}
