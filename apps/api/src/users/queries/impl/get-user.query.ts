import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities';

/**
 * Gets the user with the matching userId
 */
export class GetUserQuery {
    @ApiProperty({
        name: 'userId',
        required: false,
        default: null,
    })
    userId: number;

    user: User;

    constructor(userId: number, currentUser: User) {
        this.userId = userId;
        this.user = currentUser;
    }
}
