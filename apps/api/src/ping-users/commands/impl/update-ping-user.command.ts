/**
 * Command handler message for updating
 * users on the Ping ActiveDirectory
 */
export class UpdatePingUserCommand {
    mail: string;
    firstName: string;
    lastName: string;
    enabled: boolean;

    constructor(
        mail: string,
        firstName: string,
        lastName: string,
        enabled?: boolean,
    ) {
        this.mail = mail;
        this.firstName = firstName;
        this.lastName = lastName;
        this.enabled = enabled ?? true;
    }
}
