import { Global, Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import GlobalAahProfile from './automapper/global.profile';
import { Role, User } from './entities';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Global()
@Module({
    imports: [
        HttpModule.register({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        }),
        CqrsModule,
        TypeOrmModule.forFeature([User, Role]),
        AuthModule,
        ConfigModule,
        UsersModule,
        PassportModule,
        JwtModule.register({}),
    ],
    providers: [AuthService, GlobalAahProfile, Logger],
    exports: [CqrsModule, AuthService],
})
export default class GlobalModule {}
