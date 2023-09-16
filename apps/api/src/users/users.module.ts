import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { Role } from 'src/entities/role.entity';
import { UserQueryHandlers } from './queries/handlers';
import { UserMapperProfile } from './mapper/user.mapper.profile';
import { UserCommandHandlers } from './commands/handlers';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { AuditLogCommandHandlers } from 'src/audit-log/commands/handlers';
import { NotFoundInterceptor } from 'src/interceptors';
import { Organization } from 'src/entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role, Organization]),
        JwtModule.register({}),
        ConfigModule,
        AuditLogModule,
        PassportModule,
    ],
    providers: [
        NotFoundInterceptor,
        UserMapperProfile,
        UserService,
        ...AuditLogCommandHandlers,
        ...UserQueryHandlers,
        ...UserCommandHandlers,
    ],
    exports: [UserService],
    controllers: [UsersController],
})
export class UsersModule {}
