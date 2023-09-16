import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/entities/user.entity';
import { GetUserProfileDto } from 'src/users/dtos';
import { UserNotFoundException } from 'src/users/exceptions';
import { UserService } from 'src/users/users.service';
import { GetUserQuery } from '../impl';
import { GetUserProfileQuery } from '../impl/get-user-profile.query';

/**
 * Handles the GetUserProfileQuery message for requests to GET /users/profile/{userId}
 */
@QueryHandler(GetUserProfileQuery)
export class GetUserProfileQueryHandler
    implements IQueryHandler<GetUserProfileQuery>
{
    private readonly logger: Logger = new Logger(
        GetUserProfileQueryHandler.name,
    );
    constructor(
        private readonly userService: UserService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     * Returns a user for the ID provided
     * @param {GetUserQuery} query
     * @returns  the user for the userId provided
     */
    async execute(query: GetUserQuery): Promise<GetUserProfileDto> {
        try {
            this.logger.debug('executing query', 'GetUsersQuery');
            const userQuery: User = await this.userService.findByUserId(query);
            if (!userQuery) {
                throw new UserNotFoundException(query.userId);
            }
            const dto = this.mapper.map(userQuery, GetUserProfileDto, User);
            return dto;
        } catch (err) {
            this.logger.error(err);
            throw new InternalServerErrorException(
                'Could not get user profile',
            );
        }
    }
}
