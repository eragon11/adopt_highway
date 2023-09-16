import { BadRequestException } from '@nestjs/common';

/**
 * Throw when user is not found
 */
export class UserNameAlreadyExistsException extends BadRequestException {
    constructor(userName: string) {
        super(`A user already exists with '${userName}' as their user name`);
    }
}
