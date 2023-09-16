import { InternalServerErrorException } from '@nestjs/common';

export class SendMailException extends InternalServerErrorException {
    constructor() {
        super({}, 'Could not send the email. There was an internal problem.');
    }
}
