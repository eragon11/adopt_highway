import { User } from 'src/entities';

export class CreateDocuSignDocumentCommand {
    applicationId: number;
    currentUser: User;

    constructor(applicationId: number, currentUser: User) {
        this.applicationId = applicationId;
        this.currentUser = currentUser;
    }
}
