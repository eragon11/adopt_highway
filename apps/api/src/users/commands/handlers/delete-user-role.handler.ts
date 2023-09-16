import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAuditLogCommand } from 'src/audit-log/commands/audit-log.created';
import { AahTablesEnum, AuditLogEnum } from 'src/common/enum';
import { Role, User } from 'src/entities';
import {
    UserNotFoundException,
    UserRoleNotFoundException,
} from 'src/users/exceptions';
import { DeleteResult, Repository } from 'typeorm';
import { DeleteUserRoleCommand } from '../impl';

// file scoped variables
const DELETE_USER_ROLE_MESSAGE = 'User role deleted';

/**
 * Soft-deletes a user's role
 */
@CommandHandler(DeleteUserRoleCommand)
export class DeleteUserRoleHandler
    implements ICommandHandler<DeleteUserRoleCommand>
{
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
        private readonly commandBus: CommandBus,
    ) {}

    /**
     * Deletes a role matching the roleId
     * @param {DeleteUserRoleCommand} command
     * @returns nothing
     */
    async execute(command: DeleteUserRoleCommand): Promise<void> {
        const user = await this.userRepo.findOne({
            where: { id: command.userId },
        });

        // throw an error if there is no user
        if (!user) {
            throw new UserNotFoundException(command.userId);
        }

        // throw an error if the user has only this one role
        if (user && user?.roles?.length === 1) {
            throw new BadRequestException('Users must have at least one role');
        }

        return this.roleRepo
            .delete({
                id: command.roleId,
                user: {
                    id: command.userId,
                },
            })
            .then((deleteResponse: DeleteResult) => {
                if (!deleteResponse.affected) {
                    throw new UserRoleNotFoundException(command.roleId);
                }
            })
            .then(async () => {
                const auditLogCommand = new CreateAuditLogCommand(
                    command.currentUser.userName,
                    AahTablesEnum.role,
                    command.roleId,
                    DELETE_USER_ROLE_MESSAGE,
                    AuditLogEnum.Update,
                );
                await this.commandBus.execute(auditLogCommand);
            });
    }
}
