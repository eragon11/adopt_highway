import { User } from 'src/entities';

export class DeleteUserCommand {
    id: number;
    currentUser: User;

    constructor(userId: number, currentUser: User) {
        this.id = userId;
        this.currentUser = currentUser;
    }
}
