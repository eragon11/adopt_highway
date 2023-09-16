import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PingUsersService } from 'src/ping-users/ping-users.service';
import { GetPingUserQuery } from '../impl';
/**
 * Retrieves existing Ping AD Users matching
 * the query
 */
@QueryHandler(GetPingUserQuery)
export class GetPingUsersQueryHandler
    implements IQueryHandler<GetPingUserQuery>
{
    /**
     *
     */
    constructor(private readonly service: PingUsersService) {}

    /**
     * Runs the query to retrieve all users that have an email
     * @param {GetPingUsers} query contains mail
     * @returns A query containing the matching records
     */
    execute(query: GetPingUserQuery): Promise<any> {
        return this.service.getPingActiveDirectoryUsersByEmail(query.mail);
    }
}
