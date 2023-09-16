import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities';

/**
 * Message to handle requests to GET /users/profile/{userId}
 */
export class GetUserProfileQuery {
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
