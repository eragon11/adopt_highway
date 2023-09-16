import { Module } from '@nestjs/common';
import { PingUsersService } from './ping-users.service';
import { PingUsersController } from './ping-users.controller';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';
import { PingUserCommandHandlers, PingUsersQueryHandlers } from '.';
@Module({
    imports: [
        HttpModule.register({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        }),
    ],
    controllers: [PingUsersController],
    providers: [
        PingUsersService,
        ...PingUserCommandHandlers,
        ...PingUsersQueryHandlers,
    ],
})
export class PingUsersModule {}
