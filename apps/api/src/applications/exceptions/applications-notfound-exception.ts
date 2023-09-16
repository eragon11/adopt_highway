import { NotFoundException } from '@nestjs/common';

/**
 * Throw when users are not found
 */
export class ApplicationsNotFoundException extends NotFoundException {
    constructor() {
        super(`No applications found`);
    }
}
