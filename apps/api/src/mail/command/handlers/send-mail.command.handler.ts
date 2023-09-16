import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Config } from 'src/common';
import { SendMailCommand } from '../impl';

@CommandHandler(SendMailCommand)
export class SendMailCommandHandler
    implements ICommandHandler<SendMailCommand>
{
    private readonly logger = new Logger(SendMailCommandHandler.name);

    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
    ) {}

    createSendMailOptions(command: SendMailCommand): ISendMailOptions {
        const sendMailOptions: ISendMailOptions = {
            to: command.to,
            from: command.from,
            subject: command.subject,
        };

        if (command.text) {
            sendMailOptions.html = command.text;
        }

        if (command.template) {
            sendMailOptions.template = command.template;
            sendMailOptions.context = command.context;
        }

        if (command.attachments) {
            sendMailOptions.attachments = command.attachments;
        }

        return sendMailOptions;
    }

    /**
     * Observable that sends the email
     * @param mailOptions mail options
     * @returns {Observable}
     */
    sendMail(mailOptions: ISendMailOptions): Promise<any> {
        return this.mailerService.sendMail(mailOptions).catch((reason: any) => {
            this.logger.error(reason.message, reason.stack);
        });
    }

    /**
     * Sends emails
     * @param { SendMailCommand } command
     * @returns { void }
     */
    async execute(command: SendMailCommand): Promise<void> {
        try {
            const mailOptions: ISendMailOptions =
                this.createSendMailOptions(command);
            await this.sendMail(mailOptions).catch((reason: Error) => {
                this.logger.error(
                    `Could not send email with subject '${
                        command.subject
                    }' to '${command.to}'\n ${JSON.stringify(reason)}`,
                    SendMailCommandHandler.name,
                );
                if (this.configService.get(Config.NODE_ENV) === 'local') {
                    this.logger.error(
                        `Email sender failed... continuing on local\n ${JSON.stringify(
                            mailOptions,
                        )}`,
                    );
                    return;
                }
                throw new Error('Could not send the email');
            });
            return;
        } catch (err) {
            throw err;
        }
    }
}
