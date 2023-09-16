import { InternalServerErrorException } from '@nestjs/common';

export class MappingServiceUnavailableException extends InternalServerErrorException {
    /**
     *
     */
    constructor() {
        super('Mapping features are currently unavailable');
    }
}
