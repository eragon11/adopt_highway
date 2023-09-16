import { CreateNewUserHandler } from './create-new-user.handler';
import { CreateUserHandler } from './create-user.handler';
import { DeleteUserRoleHandler } from './delete-user-role.handler';
import { DeleteUserHandler } from './delete-user.handler';
import { UpdateUserHandler } from './update-user.handler';

export const UserCommandHandlers = [
    CreateUserHandler,
    CreateNewUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    DeleteUserRoleHandler,
];
