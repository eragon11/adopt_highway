import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    CommandBus,
    CommandHandler,
    ICommandHandler,
    QueryBus,
} from '@nestjs/cqrs';
import { ApplicationsService } from 'src/applications/applications.service';
import { DistrictsService } from 'src/districts/districts.service';
import { ConfirmApplicationByIdCommand } from '../impl';
import { ApplicationHandlerBase } from './application-handler-base';

@CommandHandler(ConfirmApplicationByIdCommand)
export class ConfirmApplicationByIdCommandHandler
    extends ApplicationHandlerBase
    implements ICommandHandler<ConfirmApplicationByIdCommand>
{
    constructor(
        protected readonly configService: ConfigService,
        protected readonly districtService: DistrictsService,
        protected readonly commandBus: CommandBus,
        protected readonly queryBus: QueryBus,
        protected readonly applicationService: ApplicationsService,
    ) {
        super(
            configService,
            districtService,
            commandBus,
            queryBus,
            applicationService,
        );
    }

    /**
     * Saves a new application
     * @param {CreateApplicationCommand} command
     * @returns void
     */
    async execute(command: ConfirmApplicationByIdCommand): Promise<string> {
        try {
            Logger.debug(
                `Confirming an application by Id ${JSON.stringify(command)}`,
            );
            return this.confirmApplicationById(
                command.applicationId,
                command.currentUser,
            );
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
