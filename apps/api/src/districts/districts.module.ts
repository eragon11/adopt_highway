import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { District } from 'src/entities/district.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { DistrictsService } from './districts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([District, User]),
        AuthModule,
        JwtModule.register({}),
        ConfigModule,
        UsersModule,
        PassportModule,
    ],
    providers: [DistrictsService],
    exports: [DistrictsService],
})
export class DistrictsModule {}
