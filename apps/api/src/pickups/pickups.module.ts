import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementsService } from 'src/agreements/agreements.service';
import { Agreement, DocusignDocument, Pickup } from 'src/entities';
import { PickupsService } from './pickups.service';
import { PickupCommandHandlers } from './commands';
import { PickupMapperProfile } from './mapper/profile';

@Module({
    imports: [TypeOrmModule.forFeature([Pickup, Agreement, DocusignDocument])],
    providers: [
        PickupMapperProfile,
        PickupsService,
        AgreementsService,
        Logger,
        ...PickupCommandHandlers,
    ],
    exports: [PickupsService],
})
export class PickupsModule {}
