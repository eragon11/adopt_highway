import { GetApplicationByIdForUserQueryHandler } from './get-application-by-id-for-user.handler';
import { GetApplicationByTokensQueryHandler } from './get-application-by-token.handler';
import { GetApplicationsQueryHandler } from './get-applications.handler';
import { GetLatestMulesoftDocumentStatusesHandler } from './get-latest-mulesoft-statuses.handler';

export const ApplicationQueryHandlers = [
    GetApplicationByIdForUserQueryHandler,
    GetApplicationByTokensQueryHandler,
    GetApplicationsQueryHandler,
    GetLatestMulesoftDocumentStatusesHandler,
];
