import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/entities';
import { UserService } from 'src/users/users.service';
import { GetDistrictCoordinatorByNumber } from '../impl';

@QueryHandler(GetDistrictCoordinatorByNumber)
export class GetDistrictCoordinatorByDistrictNumber
    implements IQueryHandler<GetDistrictCoordinatorByNumber>
{
    /**
     * Returns the first district coordinator for a given district number
     */
    constructor(private readonly userService: UserService) {}
    async execute(query: GetDistrictCoordinatorByNumber): Promise<User> {
        try {
            const user =
                await this.userService.findDistrictCoordinatorByDistrictNumber(
                    query.districtNumber,
                );

            return user;
        } catch (err) {
            Logger.error(err.message, 'GetDistrictCoordinatorByNumber');
            throw err;
        }
    }
}
