import { Logger } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { User } from 'src/entities';
import { UserService } from 'src/users/users.service';
import { GetUserByUsername } from '../impl';

@QueryHandler(GetUserByUsername)
export class GetUsersByUsernameHandler
    implements IQueryHandler<GetUserByUsername>
{
    private readonly logger = new Logger(GetUsersByUsernameHandler.name);
    constructor(private readonly service: UserService) {}

    /**
     * Gets a user with the matching username
     * @param {GetUserByUsername} query
     * @returns {User} user who matches the username provided by the query
     */
    execute(query: GetUserByUsername): Promise<User> {
        this.logger.debug(`Getting user by username ${query.userName}`);
        return this.service.getByUsername(query.userName);
    }
}
