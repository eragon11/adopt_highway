/**
 * Command handler message for creating
 * users on the Ping ActiveDirectory
 */
export class CreatePingUserCommand {
    mail: string;
    firstName: string;
    lastName: string;

    /**
     *
     * @param mail
     * @param firstName
     * @param lastName
     */
    constructor(mail: string, firstName: string, lastName: string) {
        this.mail = mail;
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
