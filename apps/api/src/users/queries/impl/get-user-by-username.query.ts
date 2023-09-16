/**
 * Retrieves a user by username
 */
export class GetUserByUsername {
    userName: string;
    constructor(userName: string) {
        this.userName = userName;
    }
}
