import { Response } from 'express';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities';

export class GetSignedDocumentQuery {
    @ApiProperty({
        name: 'agreementId',
        required: true,
        default: null,
    })
    agreementId: number;

    currentUser: User;

    response: Response;

    constructor(agreementId: number, currentUser: User, response: Response) {
        this.agreementId = agreementId;
        this.currentUser = currentUser;
        this.response = response;
    }
}
