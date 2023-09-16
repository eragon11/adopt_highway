import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities';

/**
 * Message to get one active agreement by Id
 */
export class GetActiveAgreementByIdForUserQuery {
    @ApiProperty({
        name: 'agreementId',
        required: true,
        default: null,
    })
    agreementId: number;
    currentUser: User;

    constructor(agreementId: number, currentUser: User) {
        this.agreementId = agreementId;
        this.currentUser = currentUser;
    }
}
