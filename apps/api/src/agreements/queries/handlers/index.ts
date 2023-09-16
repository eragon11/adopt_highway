import { GetActiveAgreementByIdHandler } from './get-active-agreement-by-id';
import { GetActiveAgreements } from './get-active-agreements';
import { GetAgreementByApplicationTokenHandler } from './get-agreement-by-token.handler';
import { GetPickupsByAgreementIdHandler } from './get-pickups-by-agreement-id.handler';
import { GetRenewalAgreementsHandler } from './get-renewal-agreements.handler';
import { GetSignedDocumentHandler } from './get-signed-document.handler';

export const AgreementQueryHandlers = [
    GetActiveAgreementByIdHandler,
    GetActiveAgreements,
    GetAgreementByApplicationTokenHandler,
    GetPickupsByAgreementIdHandler,
    GetRenewalAgreementsHandler,
    GetSignedDocumentHandler,
];
