import { User } from 'src/entities';

export class DeleteUserRoleCommand {
    userId: number;
    roleId: number;
    currentUser: User;

    constructor(userId: number, roleId: number, currentUser: User) {
        this.userId = userId;
        this.roleId = roleId;
        this.currentUser = currentUser;
    }
}
