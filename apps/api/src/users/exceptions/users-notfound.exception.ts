import { NotFoundException } from '@nestjs/common';

/**
 * Throw when users are not found
 */
export class UsersNotFoundException extends NotFoundException {
    constructor() {
        super(`No users found`);
    }
}
