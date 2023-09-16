import { Address, Attachment } from 'nodemailer/lib/mailer';

/**
 * Enumerator that lists hbs files that can be used as templates
 */

export enum MailTemplate {
    Test = 'test',
    RejectApplication = 'reject-application',
    ApplicationConfirmation = 'confirm-application',
    AppSubmittedToDc = 'app-submitted-to-dc',
    ApplicationCreation = 'create-application',
    ApplicationDeleted = 'delete-application',
    ApplicationUpdated = 'updated-application',
    RemovedAccess = 'removed-access',
    NewPingUserPassword = 'new-password-pinguser',
    DisabledPingUser = 'disabled-pinguser',
    NewPingUser = 'new-pinguser',
    SignApprovedToDc = 'sign-approved-to-dc',
    SignRejectedToDc = 'sign-rejected-to-dc',
    RequestSignApproval = 'request-sign-approval',
    CreateNewInternalUser = 'create-new-internal-user',
}

export class SendMailCommand {
    to: string | Address | (string | Address)[];
    from: string | Address;
    subject: string;
    text?: string;
    context: any;
    template?: MailTemplate;
    attachments?: Attachment[] | undefined;
    cc?: string | Address | (string | Address)[];
    bcc?: string | Address | (string | Address)[];
    constructor(
        to: string | Address | (string | Address)[],
        from: string | Address,
        subject: string,
        template: MailTemplate,
        text: string,
        context: any,
        attachments?: Attachment[] | undefined,
        cc?: string | Address,
        bcc?: string | Address,
    ) {
        this.to = to;
        this.from = from;
        this.subject = subject;
        this.template = template;
        this.text = text;
        this.context = context;
        this.attachments = attachments;
        this.cc = cc;
        this.bcc = bcc;
    }
}
