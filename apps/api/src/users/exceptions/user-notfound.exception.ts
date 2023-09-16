import { NotFoundException } from '@nestjs/common';

/**
 * Throw when user is not found
 */
export class UserNotFoundException extends NotFoundException {
    constructor(userId: number) {
        super(`User with id ${userId} not found`);
    }
}
