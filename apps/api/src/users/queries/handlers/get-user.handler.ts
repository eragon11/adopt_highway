import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { User } from 'src/entities/user.entity';
import { UserProfileDto } from 'src/users/dtos/user-profile.dto';
import { UserNotFoundException } from 'src/users/exceptions';
import { UserService } from 'src/users/users.service';
import { GetUserQuery } from '../impl';

/**
 * GetUsersQuery handles
 */
@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
    constructor(
        private readonly userService: UserService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     * Returns a user for the ID provided
     * @param {GetUserQuery} query
     * @returns  the user for the userId provided
     */
    async execute(query: GetUserQuery): Promise<UserProfileDto> {
        const userQuery: User = await this.userService.findByUserId(query);
        if (!userQuery) {
            throw new UserNotFoundException(query.userId);
        }
        const dto = this.mapper.map(userQuery, UserProfileDto, User);
        return dto;
    }
}
