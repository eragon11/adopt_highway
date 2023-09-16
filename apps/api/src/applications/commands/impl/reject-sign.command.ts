import { User } from 'src/entities';
import { ApplicationByIdCommandBase } from './application-by-id.base.command';

export class RejectSignByIdCommand extends ApplicationByIdCommandBase {
    signRejectionComments: string;
    /**
     *
     */
    constructor(
        applicationId: number,
        signRejectionComments: string,
        currentUser: User,
    ) {
        super(applicationId, currentUser);
        this.signRejectionComments = signRejectionComments;
    }
}
