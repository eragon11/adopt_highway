import { forwardRef, Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    Application,
    ApplicationsModule,
    ApplicationsService,
} from 'src/applications';
import { CountiesService } from 'src/counties/counties.service';
import {
    Agreement,
    County,
    DocusignDocument,
    Organization,
    Pickup,
    Role,
    Segment,
    User,
    ViewRenewalAgreement,
} from 'src/entities';
import { SegmentsService } from 'src/segments/segments.service';
import { UserService } from 'src/users/users.service';
import { AgreementsService } from './agreements.service';
import { AgreementCommandHandlers } from './commands/handlers';
import { AgreementsMapperProfile } from './mappers';
import { AgreementQueryHandlers } from './queries/handlers';
@Module({
    imports: [
        TypeOrmModule.forFeature([
            Agreement,
            Application,
            County,
            DocusignDocument,
            Organization,
            Pickup,
            Role,
            Segment,
            User,
            ViewRenewalAgreement,
        ]),
        forwardRef(() => ApplicationsModule),
    ],
    providers: [
        AgreementsMapperProfile,
        AgreementsService,
        ApplicationsService,
        CountiesService,
        Logger,
        SegmentsService,
        UserService,
        ...AgreementQueryHandlers,
        ...AgreementCommandHandlers,
    ],
    exports: [AgreementsService],
})
export class AgreementsModule {}
