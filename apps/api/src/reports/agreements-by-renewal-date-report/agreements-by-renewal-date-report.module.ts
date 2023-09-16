import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from 'src/entities/agreement.entity';
import { AgreementsByRenewalDateReportController } from './agreements-by-renewal-date-report.controller';
import { AgreementsByRenewalDateMapperProfile } from './agreements-by-renewal-date-report.mapper.profile';
import { AgreementsByRenewalDateReportService } from './agreements-by-renewal-date-report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Agreement])],
    providers: [
        AgreementsByRenewalDateReportService,
        AgreementsByRenewalDateMapperProfile,
    ],
    controllers: [AgreementsByRenewalDateReportController],
    exports: [AgreementsByRenewalDateReportService],
})
export class AgreementsByRenewalDateReportModule {}
