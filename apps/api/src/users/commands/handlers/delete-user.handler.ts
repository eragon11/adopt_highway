import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import { AahTablesEnum, AuditLogEnum } from 'src/common/enum';
import { User } from 'src/entities';
import { UserNotFoundException } from 'src/users/exceptions/user-notfound.exception';
import { Repository, UpdateResult } from 'typeorm';
import { DeleteUserCommand } from '../impl';

// file scoped variables
const DELETE_USER_MESSAGE = 'User deleted';

/**
 * Soft-deletes a user
 */
@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        private readonly commandBus: CommandBus,
    ) {}

    async execute(command: DeleteUserCommand): Promise<void> {
        return this.userRepo
            .softDelete(command.id)
            .then((deleteResponse: UpdateResult) => {
                if (!deleteResponse.affected) {
                    throw new UserNotFoundException(command.id);
                }
            })
            .then(async () => {
                const auditLogCommand = new CreateAuditLogCommand(
                    command.currentUser.userName,
                    AahTablesEnum.userPerson,
                    command.id,
                    DELETE_USER_MESSAGE,
                    AuditLogEnum.Update,
                );
                await this.commandBus.execute(auditLogCommand);
            });
    }
}
