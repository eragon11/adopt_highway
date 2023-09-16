import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from 'src/entities/agreement.entity';
import { AgreementReportController } from './agreement-report.controller';
import { AgreementReportMapperProfile } from './agreement-report.mapper.profile';
import { AgreementReportService } from './agreement-report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Agreement])],
    providers: [AgreementReportService, AgreementReportMapperProfile],
    controllers: [AgreementReportController],
    exports: [AgreementReportService],
})
export class AgreementReportModule {}
