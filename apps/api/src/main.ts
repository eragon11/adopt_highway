import * as dotenv from 'dotenv';
import findConfig from 'find-config';

dotenv.config({ path: findConfig('.env') });

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionFilter, Logger, ValidationPipe } from '@nestjs/common';
import { AahCorsOptions } from './common/cors.options';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import { getLogLevels } from './getLogLevel';
import { ConfigService } from '@nestjs/config';
import {
    ForbiddenExceptionFilter,
    ThrottlerExceptionFilter,
} from './exceptionfilters';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const certFile = fs.readFileSync(`${process.env.HTTPS_PFX_FILE}`);

    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: getLogLevels(process.env.NODE_ENV === 'production'),
        httpsOptions: {
            pfx: certFile,
            passphrase: process.env.HTTPS_PASSPHRASE,
            rejectUnauthorized: false,
        },
    });

    // use optional global prefix e.g., https://app.txdot.gov/api
    if ((process.env.API_GLOBAL_PREFIX || '').length > 0) {
        app.setGlobalPrefix(process.env.API_GLOBAL_PREFIX);
    }

    // configure Swagger
    if (process.env.NODE_ENV !== 'production') {
        const swaggerConfig = new DocumentBuilder()
            .setTitle(process.env.API_TITLE)
            .setDescription(process.env.API_DESCRIPTION)
            .setVersion(process.env.API_VERSION)
            .build();
        const document = SwaggerModule.createDocument(app, swaggerConfig);
        SwaggerModule.setup('api', app, document, {
            swaggerOptions: {
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
            },
        });
    }

    // configure CORS support
    app.enableCors(AahCorsOptions);
    app.use(cookieParser());

    // add helmet supp\ort
    app.use(helmet());

    // validation
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // add global exception filters
    const globalFilters: ExceptionFilter[] = [
        new ForbiddenExceptionFilter(app.get(ConfigService)),
        new ThrottlerExceptionFilter(),
    ];
    app.useGlobalFilters(...globalFilters);

    // There will be a load balancer, so we need to trust our proxy's "X Forward For" headers
    app.set('trust proxy', 1);

    // start api
    await app.listen(parseInt(process.env.API_PORT, 10), () => {
        Logger.debug(
            `AAH API running on port ${process.env.API_PORT}`,
            'Bootstrap',
        );
    });
}

void bootstrap();
