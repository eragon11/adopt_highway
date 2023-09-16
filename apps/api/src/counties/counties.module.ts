import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { County } from 'src/entities/county.entity';
import { User } from 'src/entities/user.entity';
import { UsersModule } from 'src/users/users.module';
import { CountiesService } from './counties.service';
import { CountyMapperProfile } from './mappers';

@Module({
    imports: [
        TypeOrmModule.forFeature([County, User]),
        AuthModule,
        JwtModule.register({}),
        ConfigModule,
        UsersModule,
        PassportModule,
        CountyMapperProfile,
    ],
    providers: [CountiesService],
    exports: [CountiesService],
})
export class CountiesModule {}
