import { RequestSignApprovalByIdCommandHandler } from './request-sign-approval.handler';
import { ApproveSignByIdCommandHandler } from './approve-sign-by-id.handler';
import { CreateApplicationCommandHandler } from './create-application.handler';
import { ConfirmApplicationByTokensCommandHandler } from './confirm-application-by-tokens.handler';
import { DeleteApplicationByTokensCommandHandler } from './delete-application-by-tokens.handler';
import { UpdateApplicationByIdCommandHandler } from './update-application-by-id.handler';
import { UpdateApplicationByTokensCommandHandler } from './update-application-by-tokens.handler';
import { DeleteUnconfirmedAppsCommandHandler } from './delete-unconfirmed-apps.handler';
import { DeleteApplicationByIdCommandHandler } from './delete-application-by-id.handler';
import { ConfirmApplicationByIdCommandHandler } from './confirm-application-by-id.handler';
import { RejectSignByIdCommandHandler } from './reject-sign-by-id.handler';
import { CreateDocuSignDocumentHandler } from './create-docusign-document.handler';
import { UpdateDocuSignDocumentStatusesCommandHandler } from './update-latest-docusign-document-status.handler';

export { DeleteApplicationCommandHandlerBase } from './delete-application-command-handler.base';

export const ApplicationCommandHandlers = [
    ApproveSignByIdCommandHandler,
    ConfirmApplicationByIdCommandHandler,
    ConfirmApplicationByTokensCommandHandler,
    CreateApplicationCommandHandler,
    CreateDocuSignDocumentHandler,
    DeleteApplicationByIdCommandHandler,
    DeleteApplicationByTokensCommandHandler,
    DeleteUnconfirmedAppsCommandHandler,
    RejectSignByIdCommandHandler,
    RequestSignApprovalByIdCommandHandler,
    UpdateApplicationByIdCommandHandler,
    UpdateApplicationByTokensCommandHandler,
    UpdateDocuSignDocumentStatusesCommandHandler,
];
