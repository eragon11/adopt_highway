import { User } from 'src/entities';

export class GetAgreementByApplicationTokenQuery {
    applicationToken: string;
    currentUser: User;
    constructor(applicationToken: string, currentUser: User) {
        this.applicationToken = applicationToken;
        this.currentUser = currentUser;
    }
}
