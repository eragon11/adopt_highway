import { Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { Config } from 'src/common';
import { MailTemplate, SendMailCommand } from 'src/mail/command/impl';
import { PingEntry } from 'src/ping-users/dto';
import { PingUsersService } from 'src/ping-users/ping-users.service';
import { GetPingUserQuery } from 'src/ping-users/queries';
import { DeletePingUserCommand } from '../impl';

@CommandHandler(DeletePingUserCommand)
export class DeletePingUserCommandHandler
    implements ICommandHandler<DeletePingUserCommand>
{
    /**
     *
     */
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly service: PingUsersService,
        private readonly configService: ConfigService,
    ) {}

    private async sendAccessRemovalEmail(mail): Promise<void> {
        const sendEmailMessage = new SendMailCommand(
            [mail],
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            'Adopt a Highway access has been removed',
            MailTemplate.ApplicationDeleted,
            null,
            null,
        );

        await this.commandBus.execute(sendEmailMessage);
    }

    /**
     * Delete a user by email
     * @param command message with email of user to delete
     */
    async execute(command: DeletePingUserCommand): Promise<void> {
        Logger.debug('Delete ping user');
        const { mail } = command;
        const queryResult = (await this.queryBus.execute(
            new GetPingUserQuery(mail),
        )) as PingEntry[];

        if (!queryResult || !queryResult[0]) {
            throw new NotFoundException(
                `No Ping User found with the email: ${mail}`,
            );
        }

        await this.service.deletePingUser(queryResult[0]);
        await this.sendAccessRemovalEmail(mail);
    }
}
