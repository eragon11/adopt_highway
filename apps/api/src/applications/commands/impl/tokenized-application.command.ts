/**
 * Abstract class for commands only the two application tokens
 */
export abstract class TokenizedApplicationCommand {
    applicationToken: string;
    accessToken: string;

    constructor(applicationToken: string, accessToken: string) {
        this.applicationToken = applicationToken;
        this.accessToken = accessToken;
    }
}
