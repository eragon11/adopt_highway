/* eslint-disable prettier/prettier */
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './config/typeorm.config';
import { LoggerMiddleware } from './logger.middleware';
import { UsersModule } from './users/users.module';
import { PickupsModule } from './pickups/pickups.module';
import { PickupsController } from './pickups/pickups.controller';
import { AgreementsController } from './agreements/agreements.controller';
import { AgreementsModule } from './agreements/agreements.module';
import { SegmentsModule } from './segments/segments.module';
import { GisTokenController } from './gis-token/gis-token.controller';
import { GisTokenModule } from './gis-token/gis-token.module';
import { PickupReportController } from './reports/pickup-report/pickup-report.controller';
import { PickupReportModule } from './reports/pickup-report/pickup-report.module';
import { AgreementReportModule } from './reports/agreement-report/agreement-report.module';
import { AgreementReportController } from './reports/agreement-report/agreement-report.controller';
import { SegmentReportController } from './reports/segment-report/segment-report.controller';
import { SegmentReportModule } from './reports/segment-report/segment-report.module';
import { SegmentsController } from './segments/segments.controller';
import { GroupTypeInfoReportController } from './reports/group-type-info-report/group-type-info-report.controller';
import { GroupTypeInfoReportModule } from './reports/group-type-info-report/group-type-info-report.module';
import { AgreementsByRenewalDateReportController } from './reports/agreements-by-renewal-date-report/agreements-by-renewal-date-report.controller';
import { AgreementsByRenewalDateReportModule } from './reports/agreements-by-renewal-date-report/agreements-by-renewal-date-report.module';
import { DistrictsModule } from './districts/districts.module';
import { MaintenanceSectionController } from './maintenance-sections/maintenance-section.controller';
import { MaintenanceSectionsModule } from './maintenance-sections/maintenance-section.module';
import { DistrictsController } from './districts/districts.controller';
import { CountyController } from './counties/counties.controller';
import { CountiesModule } from './counties/counties.module';
import GlobalModule from './global.module';
import { SignReportController } from './reports/sign-report/sign-report.controller';
import { SignReportModule } from './reports/sign-report/sign-report.module';
import { GroupReportController } from './reports/group-report/group-report.controller';
import { GroupReportModule } from './reports/group-report/group-report.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { AuditLogController } from './audit-log/audit-log.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { MailModule } from './mail/mail.module';
import { MailController } from './mail/mail.controller';
import { ApplicationsModule } from './applications/applications.module';
import { PingUsersModule } from './ping-users/ping-users.module';
import { ApplicationsController } from './applications/applications.controller';
import { CronService } from './cron/cron.service';
import { GroupsModule } from './groups';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        EventEmitterModule.forRoot(),
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            useClass: TypeOrmConfigService,
        }),
        AutomapperModule.forRoot({
            options: [{ name: 'aah', pluginInitializer: classes }],
            singular: true,
        }),
        HttpModule,
        GlobalModule,
        AuthModule,
        UsersModule,
        PickupsModule,
        AgreementsModule,
        SegmentsModule,
        AgreementReportModule,
        PickupReportModule,
        GisTokenModule,
        SegmentReportModule,
        AgreementsByRenewalDateReportModule,
        GroupReportModule,
        GroupTypeInfoReportModule,
        SignReportModule,
        DistrictsModule,
        MaintenanceSectionsModule,
        CountiesModule,
        AuditLogModule,
        MailModule,
        ApplicationsModule,
        PingUsersModule,
        GroupsModule,
    ],
    controllers: [
        AppController,
        AgreementReportController,
        ApplicationsController,
        AgreementsByRenewalDateReportController,
        GroupReportController,
        GroupTypeInfoReportController,
        PickupReportController,
        SegmentReportController,
        SignReportController,
        DistrictsController,
        MaintenanceSectionController,
        CountyController,
        AgreementsController,
        PickupsController,
        SegmentsController,
        GisTokenController,
        AuditLogController,
        MailController,
    ],
    providers: [CronService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
