import { Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PingUsersService } from 'src/ping-users/ping-users.service';
import { CreatePingUserCommand } from '../impl';

@CommandHandler(CreatePingUserCommand)
export class CreatePingUserHandler
    implements ICommandHandler<CreatePingUserCommand>
{
    constructor(private readonly service: PingUsersService) {}

    /**
     * Handler for the CreatePingUserCommand message
     * @param CreatePingUserCommand command
     * @returns PingEntry of the new user
     */
    async execute(command: CreatePingUserCommand): Promise<any> {
        Logger.debug('Executing command handler for CreatePingUserCommand');
        return await this.service.createPingUser(
            command.mail,
            command.firstName,
            command.lastName,
        );
    }
}
