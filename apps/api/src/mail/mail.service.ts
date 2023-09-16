import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    public example(): void {
        this.mailerService
            .sendMail({
                to: 'test@nestjs.com', // list of receivers
                from: 'noreply@nestjs.com', // sender address
                subject: 'TEST EMAIL', // Subject line
                template: 'test',
                context: {
                    name: 'Kevin C. Davis',
                    url: 'https://ethereal.email',
                },
            })
            .catch((err) => Logger.error(err.message, 'MailService'));
    }
}
