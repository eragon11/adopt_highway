import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Application } from 'src/applications/entities/application.entity';
import { GetApplicationByTokensQuery } from 'src/applications/queries/impl';
import { DeleteApplicationByTokensCommand } from '../impl';
import { DeleteApplicationCommandHandlerBase } from './delete-application-command-handler.base';

/**
 * Handles commands for deleting a command using tokens
 */
@CommandHandler(DeleteApplicationByTokensCommand)
export class DeleteApplicationByTokensCommandHandler
    extends DeleteApplicationCommandHandlerBase
    implements ICommandHandler<DeleteApplicationByTokensCommand>
{
    /**
     * Deletes an application
     * @param {DeleteApplicationByTokensCommand} command
     * @returns void
     */
    async execute(command: DeleteApplicationByTokensCommand): Promise<void> {
        Logger.debug(`Deleting an application ${JSON.stringify(command)}`);

        const application: Application = await this.queryBus.execute(
            new GetApplicationByTokensQuery(
                command.applicationToken,
                command.accessToken,
            ) as Application,
        );

        // get the primary contact's email before we delete
        const primaryContactEmail: string = await this.getVolunteerEmail(
            application.id,
        );

        // delete the app using the tokens
        await this.deleteApplication(application.id);

        // inform the contact that we deleted
        await this.sendVolunteerConfirmationEmail(primaryContactEmail);

        return;
    }
}
