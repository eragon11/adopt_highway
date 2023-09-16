import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agreement } from 'src/entities/agreement.entity';
import { GroupReportController } from './group-report.controller';
import { GroupReportMapperProfile } from './group-report.mapper.profile';
import { GroupReportService } from './group-report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Agreement])],
    controllers: [GroupReportController],
    providers: [GroupReportService, GroupReportMapperProfile],
    exports: [GroupReportService],
})
export class GroupReportModule {}
