import { User } from 'src/entities';

export abstract class ApplicationByIdCommandBase {
    applicationId: number;
    currentUser: User;
    constructor(applicationId: number, currentUser: User) {
        this.applicationId = applicationId;
        this.currentUser = currentUser;
    }
}
