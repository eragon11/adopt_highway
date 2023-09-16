import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupSponsor } from 'src/entities/groupSponsor.entity';
import GlobalModule from 'src/global.module';
import { GroupTypeInfoReportController } from './group-type-info-report.controller';
import { GroupTypeInfoReportService } from './group-type-info-report.service';

@Module({
    imports: [TypeOrmModule.forFeature([GroupSponsor]), GlobalModule],
    providers: [GroupTypeInfoReportService],
    controllers: [GroupTypeInfoReportController],
    exports: [GroupTypeInfoReportService],
})
export class GroupTypeInfoReportModule {}
