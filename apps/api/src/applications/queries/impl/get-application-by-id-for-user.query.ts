import { User } from 'src/entities';

/**
 * Message to get one application by Id
 */
export class GetApplicationByIdForUserQuery {
    applicationId: number;
    currentUser: User;

    constructor(applicationId: number, currentUser: User) {
        this.applicationId = applicationId;
        this.currentUser = currentUser;
    }
}
