import { CreatePingUserHandler } from './create-ping-user.handler';
import { DeletePingUserCommandHandler } from './delete-ping-user.handler';
import { UpdatePingUserCommandHandler } from './update-ping-user.command.handler';

export const PingUserCommandHandlers = [
    CreatePingUserHandler,
    DeletePingUserCommandHandler,
    UpdatePingUserCommandHandler,
];
