import { Logger, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailCommandHandlers } from './command/handlers';
import { MailController } from './mail.controller';
import { CommandBus } from '@nestjs/cqrs';
import { MailMapperProfile } from './mappers/mail.mapper.profile';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Config } from 'src/common';

const tlsEnabled = (config: ConfigService) => {
    return {
        transport: {
            host: config.get(Config.SMTP_HOST),
            port: parseInt(config.get(Config.SMTP_PORT), 10),
            secure: false,
            tls: {
                rejectUnauthorized:
                    config.get(Config.SMTP_TLS_REJECT_UNAUTHORIZED) === 'true',
                enableTrace:
                    config.get(Config.SMTP_TLS_ENABLE_TRACE) === 'true',
                maxVersion: config.get(Config.SMTP_TLS_MAX_VERSION),
                minVersion: config.get(Config.SMTP_TLS_MAX_VERSION),
                ciphers: config.get(Config.SMTP_TLS_CIPHER),
            },
        },
        defaults: {
            from: `"TxDOT Adopt-A-Highway Administrator" <${config.get(
                Config.AAH_ADMIN_EMAIL,
            )}>`,
        },
        options: {
            logger: Logger,
            debug: true,
        },
        template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(undefined, {
                inlineCssEnabled: true,
                inlineCssOptions: {
                    url: ' ',
                    preserveMediaQueries: true,
                },
            }),
            options: {
                strict: true,
            },
        },
    };
};

const smtpOnly = (config: ConfigService) => {
    return {
        transport: {
            host: config.get(Config.SMTP_HOST),
            port: parseInt(config.get(Config.SMTP_PORT), 10),
            secure: false,
            auth: {
                user: config.get(Config.SMTP_USER),
                pass: config.get(Config.SMTP_PASSWORD),
            },
        },
        defaults: {
            from: `"TxDOT Adopt-A-Highway Administrator" <${config.get(
                Config.AAH_ADMIN_EMAIL,
            )}>`,
        },
        options: {
            logger: Logger,
            debug: true,
        },
        template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(undefined, {
                inlineCssEnabled: true,
                inlineCssOptions: {
                    url: ' ',
                    preserveMediaQueries: true,
                },
            }),
            options: {
                strict: true,
            },
        },
    };
};

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => {
                if (config.get(Config.SMTP_USER).trim().length > 0) {
                    return smtpOnly(config);
                }
                return tlsEnabled(config);
            },
            inject: [ConfigService],
        }),
        ConfigModule.forRoot(),
    ],
    providers: [MailMapperProfile, CommandBus, ...MailCommandHandlers],
    controllers: [MailController],
})
export class MailModule {}
