import { Module } from '@nestjs/common';
import { SignReportService } from './sign-report.service';
import { SignReportController } from './sign-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SignReportMapperProfile } from './sign-report.mapper.profile';
import { Sign } from 'src/entities/sign.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Sign])],
    providers: [SignReportService, SignReportMapperProfile],
    controllers: [SignReportController],
    exports: [SignReportService],
})
export class SignReportModule {}
