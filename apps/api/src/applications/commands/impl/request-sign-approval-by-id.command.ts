import { User } from 'src/entities';
import { ApplicationByIdCommandBase } from './application-by-id.base.command';

export class RequestSignApprovalByIdCommand extends ApplicationByIdCommandBase {
    signRequestDescription: string;

    constructor(
        applicationId: number,
        signRequestDescription: string,
        user: User,
    ) {
        super(applicationId, user);
        this.signRequestDescription = signRequestDescription;
    }
}
