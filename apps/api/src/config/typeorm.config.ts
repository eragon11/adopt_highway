import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Config } from 'src/common/enum';
import { getTypeOrmLogLevels } from 'src/getLogLevel';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}

    createTypeOrmOptions(): TypeOrmModuleOptions {
        return {
            type: 'mssql',
            host: this.configService.get(Config.DB_HOST),
            username: this.configService.get(Config.DB_USER),
            password: this.configService.get(Config.DB_PASSWORD),
            database: this.configService.get(Config.DB_NAME),
            logging: getTypeOrmLogLevels(process.env.NODE_ENV === 'production'),
            logger: 'simple-console',
            autoLoadEntities: true,
            synchronize: false,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            options: {
                connectTimeout: 60 * 1000,
                enableArithAbort: false,
            },
            extra: {
                trustServerCertificate: true,
            },
        };
    }
}
