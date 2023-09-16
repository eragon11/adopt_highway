import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/entities';
import { UserService } from 'src/users/users.service';
import { GetDistrictCoordinatorsForCountyNumberQuery } from '../impl';

@QueryHandler(GetDistrictCoordinatorsForCountyNumberQuery)
export class GetDistrictCoordinatorByCounty
    implements IQueryHandler<GetDistrictCoordinatorsForCountyNumberQuery>
{
    /**
     * Returns the first district coordinator for a given district number
     */
    constructor(private readonly userService: UserService) {}
    async execute(
        query: GetDistrictCoordinatorsForCountyNumberQuery,
    ): Promise<User[]> {
        try {
            const users =
                await this.userService.findDistrictCoordinatorsByCountyNumber(
                    query.countyNumber,
                );

            return users;
        } catch (err) {
            Logger.error(err.message, 'GetDistrictCoordinatorByNumber');
            throw err;
        }
    }
}
