import { NotFoundException } from '@nestjs/common';

/**
 * Throw when user role is not found
 */
export class UserRoleNotFoundException extends NotFoundException {
    constructor(roleId: number) {
        super(`User role with id ${roleId} not found`);
    }
}
