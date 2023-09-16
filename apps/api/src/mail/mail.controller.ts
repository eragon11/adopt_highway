import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { CAN_SEND_MAIL } from 'src/common/permissions';
import { SendMailCommand } from './command/impl/send-mail.command';
import { SendMailDto } from './dtos';

@UseGuards(JwtAuthenticationGuard)
@Controller('mail')
export class MailController {
    constructor(
        private readonly commandBus: CommandBus,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard([...CAN_SEND_MAIL]))
    @Post()
    async send(@Body() dto: SendMailDto) {
        const command = this.mapper.map(dto, SendMailCommand, SendMailDto);
        await this.commandBus.execute(command);
    }
}
