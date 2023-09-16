import { Module } from '@nestjs/common';
import { GisTokenController } from './gis-token.controller';
import { GisTokenService } from './gis-token.service';
import { HttpModule } from '@nestjs/axios';
import * as https from 'https';

@Module({
    imports: [
        HttpModule.register({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        }),
    ],
    controllers: [GisTokenController],
    providers: [GisTokenService],
    exports: [GisTokenService],
})
export class GisTokenModule {}
