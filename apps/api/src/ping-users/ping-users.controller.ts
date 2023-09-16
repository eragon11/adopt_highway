import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Logger,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import { CAN_CREATE_USERS, CAN_VIEW_USERS } from 'src/common';
import {
    CreatePingUserCommand,
    GetPingUserQuery,
    UpdatePingUserCommand,
} from '.';
import { CreatePingUser, PingEntry } from './dto';
import { UpdatePingUserDto } from './dto/update-ping-user.dto';

@UseGuards(JwtAuthenticationGuard)
@Controller('ping-users')
export class PingUsersController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    @HttpCode(HttpStatus.OK)
    @Get(':mail')
    @UseGuards(RoleGuard([...CAN_VIEW_USERS]))
    getByEmail(@Param('mail') mail: string): Promise<PingEntry[]> {
        const query: GetPingUserQuery = new GetPingUserQuery(mail);
        return this.queryBus.execute(query);
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(RoleGuard([...CAN_CREATE_USERS]))
    @Patch(':mail')
    async update(@Param('mail') mail: string, @Body() dto: UpdatePingUserDto) {
        return await this.commandBus.execute(
            new UpdatePingUserCommand(
                mail,
                dto.firstName,
                dto.lastName,
                dto.enabled,
            ),
        );
    }

    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RoleGuard([...CAN_CREATE_USERS]))
    @Post()
    async createNewPingUser(@Body() pingUser: CreatePingUser): Promise<any> {
        Logger.debug(
            `Create new ping user for ${JSON.stringify(pingUser)}`,
            PingUsersController.name,
        );
        const res = await this.commandBus.execute(
            new CreatePingUserCommand(
                pingUser.mail,
                pingUser.firstName.trim(),
                pingUser.lastName.trim(),
            ),
        );
        return res;
    }
}
