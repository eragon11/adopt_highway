import { Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { Config } from 'src/common/enum';
import { MailTemplate, SendMailCommand } from 'src/mail/command/impl';
import { PingUsersService } from 'src/ping-users/ping-users.service';
import { PingEntry } from '../../dto';
import { GetPingUserQuery } from '../../queries/impl';
import { UpdatePingUserCommand } from '../impl';

export type pingAttributes =
    | 'sn'
    | 'cn'
    | 'mail'
    | 'userPrincipalName'
    | 'ds-pwp-account-disabled';
export type pingModificationTypes = 'add' | 'remove' | 'set';

export class modification {
    attributeName: pingAttributes;
    modificationType: pingModificationTypes;
    values: string[] | boolean;
    constructor(
        attributeName: pingAttributes,
        modificationType: pingModificationTypes,
        value: string[] | boolean,
    ) {
        this.attributeName = attributeName;
        this.modificationType = modificationType;
        this.values = value;
    }
}

/**
 * Updates a Ping user
 */
@CommandHandler(UpdatePingUserCommand)
export class UpdatePingUserCommandHandler
    implements ICommandHandler<UpdatePingUserCommand>
{
    constructor(
        private readonly service: PingUsersService,
        private readonly configService: ConfigService,
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    /**
     * returns the Ping user value from the email
     * @param mail email
     * @returns string value of the _dn from Ping query
     */
    private async getPingEntryByEmail(mail: string): Promise<PingEntry> {
        const userEntries: PingEntry[] = await this.queryBus.execute(
            new GetPingUserQuery(mail),
        );

        if (!userEntries || userEntries.length === 0) {
            throw new NotFoundException(
                `There is not user with email: ${mail}`,
            );
        }

        return userEntries[0];
    }

    /**
     * Returns a modification object used in PATCH requests
     * @param {PingEntry} pe
     * @param {UpdatePingUserCommand} command
     * @returns a data object with modifications
     */
    private createModificationData(
        pe: PingEntry,
        command: UpdatePingUserCommand,
    ) {
        const mods: Array<modification> = [];

        if (command.lastName && command.lastName.trim() !== '') {
            mods.push(new modification('cn', 'remove', [pe?.cn[0]]));
            mods.push(new modification('cn', 'add', [command.lastName]));
        }

        if (
            command.firstName &&
            command.firstName.trim() !== '' &&
            command.lastName &&
            command.lastName.trim() !== ''
        ) {
            mods.push(new modification('sn', 'remove', [pe?.sn[0]]));
            mods.push(
                new modification('sn', 'add', [
                    `${command.firstName} ${command.lastName}`,
                ]),
            );
        }

        if (command.enabled) {
            Logger.debug('Enable this user');
            mods.push(
                new modification('ds-pwp-account-disabled', 'remove', true),
            );
        } else {
            Logger.debug('Disable this user');
            mods.push(new modification('ds-pwp-account-disabled', 'set', true));
        }
        return { modifications: mods };
    }

    private async sendDisabledEmail(
        enabled: boolean,
        mail: string,
    ): Promise<void> {
        // exit early if enabled
        if (enabled) {
            return;
        }
        Logger.debug(`Send disabled profile email to ${mail}`);
        const sendEmailMessage = new SendMailCommand(
            [mail],
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            'Your Adopt a Highway account was disabled',
            MailTemplate.DisabledPingUser,
            null,
            { mail },
        );

        await this.commandBus.execute(sendEmailMessage);
    }

    private async sendUpdateEmail(mail): Promise<void> {
        Logger.debug(`Send updated profile email to ${mail}`);
        const sendEmailMessage = new SendMailCommand(
            [mail],
            this.configService.get(Config.SMTP_MAIL_FROM_ACCOUNT),
            'Adopt a Highway account was updated',
            null,
            'Your TxDOT Adopt a Highway user profile was updated. If this was not expected, please contact your plan coordinator.',
            null,
        );

        await this.commandBus.execute(sendEmailMessage);
    }

    /**
     * Update a user on Ping AD
     * @param command
     * @returns {Promise<void>} void
     */
    async execute(command: UpdatePingUserCommand): Promise<void> {
        Logger.debug(
            `Updating user ${command.mail}`,
            UpdatePingUserCommandHandler.name,
        );
        const pe = await this.getPingEntryByEmail(command.mail);
        const data = this.createModificationData(pe, command);
        const url = `https://${this.configService.get(
            Config.PING_AD_HOST,
        )}/directory/v1/${pe._dn}`;

        await this.service.patchPingQuery(url, data);
        await this.sendUpdateEmail(command.mail);
        await this.sendDisabledEmail(command.enabled, command.mail);
        return;
    }
}
