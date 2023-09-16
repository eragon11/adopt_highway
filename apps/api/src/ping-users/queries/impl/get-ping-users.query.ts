/**
 * Query handler message to query
 * Ping ActiveDirectory
 */
export class GetPingUserQuery {
    mail: string;

    /**
     *
     * @param mail email
     */
    constructor(mail: string) {
        this.mail = mail;
    }
}
