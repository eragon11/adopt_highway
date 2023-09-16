import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationMapperProfile } from './mappers/application.mapper.profile';
import { Application } from './entities/application.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLogModule } from 'src/audit-log/audit-log.module';
import { ApplicationCommandHandlers } from './commands/handlers';
import { ApplicationQueryHandlers } from './queries/handlers';
import { DistrictsModule } from 'src/districts/districts.module';
import { ApplicationsService } from './applications.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from '../cron/cron.service';
import { AgreementsModule } from 'src/agreements';
import { Agreement, DocusignDocument } from 'src/entities';
import { SegmentsModule } from 'src/segments/segments.module';

@Module({
    imports: [
        forwardRef(() => AgreementsModule),
        AuditLogModule,
        ConfigModule,
        DistrictsModule,
        HttpModule,
        JwtModule.register({}),
        PassportModule,
        ScheduleModule.forRoot(),
        SegmentsModule,
        TypeOrmModule.forFeature([Application, Agreement, DocusignDocument]),
    ],
    controllers: [ApplicationsController],
    providers: [
        ...ApplicationCommandHandlers,
        ...ApplicationQueryHandlers,
        ApplicationMapperProfile,
        ApplicationsService,
        CronService,
    ],
    exports: [ApplicationsService],
})
export class ApplicationsModule {}
