import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { MaintenanceSectionService } from './maintenance-section.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([MaintenanceSection, User]),
        AuthModule,
        JwtModule.register({}),
        ConfigModule,
        UsersModule,
        PassportModule,
    ],
    providers: [MaintenanceSectionService],
    exports: [MaintenanceSectionService],
})
export class MaintenanceSectionsModule {}
