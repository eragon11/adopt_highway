import { Logger, NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Application } from 'src/applications/entities/application.entity';
import { GetApplicationByIdForUserQuery } from 'src/applications/queries/impl';
import { DeleteApplicationByIdCommand } from '../impl';
import { DeleteApplicationCommandHandlerBase } from './delete-application-command-handler.base';

@CommandHandler(DeleteApplicationByIdCommand)
export class DeleteApplicationByIdCommandHandler
    extends DeleteApplicationCommandHandlerBase
    implements ICommandHandler<DeleteApplicationByIdCommand>
{
    async execute(command: DeleteApplicationByIdCommand): Promise<void> {
        Logger.debug(`Deleting an application ${JSON.stringify(command)}`);

        const application: Application = (await this.queryBus.execute(
            new GetApplicationByIdForUserQuery(
                command.applicationId,
                command.currentUser,
            ),
        )) as Application;

        if (!application) {
            throw new NotFoundException('The application could not be deleted');
        }

        // get the primary contact's email before we delete
        const primaryContactEmail: string = await this.getVolunteerEmail(
            command.applicationId,
        );

        // delete the app using the tokens
        await this.deleteApplication(command.applicationId);

        // inform the contact that we deleted
        await this.sendVolunteerConfirmationEmail(primaryContactEmail);

        return;
    }
}
