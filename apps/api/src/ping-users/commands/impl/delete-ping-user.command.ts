export class DeletePingUserCommand {
    mail: string;

    /**
     * Deletes a user from the email
     * @param mail email to delete
     */
    constructor(mail: string) {
        this.mail = mail;
    }
}
