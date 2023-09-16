import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pickup } from 'src/entities/pickup.entity';
import { PickupReportController } from './pickup-report.controller';
import { PickupReportMapperProfile } from './pickup-report.mapper.profile';
import { PickupReportService } from './pickup-report.service';

@Module({
    imports: [TypeOrmModule.forFeature([Pickup])],
    providers: [PickupReportService, PickupReportMapperProfile],
    controllers: [PickupReportController],
    exports: [PickupReportService],
})
export class PickupReportModule {}
