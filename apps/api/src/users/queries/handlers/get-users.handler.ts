import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
    Pagination,
    createPaginationObject,
    paginate,
    PaginationTypeEnum,
} from 'nestjs-typeorm-paginate';
import { User } from 'src/entities/user.entity';
import {
    countQuery,
    OrderByEnum,
    PaginationOptions,
} from 'src/reports/utils/report.utils';
import { UserProfileDto } from 'src/users/dtos/user-profile.dto';
import { UsersNotFoundException } from 'src/users/exceptions/users-notfound.exception';
import { UserService } from 'src/users/users.service';
import { GetUsersQuery } from '../impl';

/**
 * GetUsersQuery handles
 */
@QueryHandler(GetUsersQuery)
export class GetUsersQueryHandler implements IQueryHandler<GetUsersQuery> {
    constructor(
        private readonly userService: UserService,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     * Returns
     * @param {GetUsersQuery} query
     * @returns  all users for the query provided
     */
    async execute(query: GetUsersQuery): Promise<Pagination<UserProfileDto>> {
        Logger.debug('executing query', 'GetUsersQuery');

        // get the total count first
        const totalItems = await countQuery<User>(
            this.userService
                .findAllInternalUsers(query)
                .select('u.USER_ID, u.LAST_NAME')
                .distinct(true),
        );

        // run the query again but with last name ordering
        const userQuery = this.userService.findAllInternalUsers(query);
        userQuery.addSelect('u.LAST_NAME', 'o_ORDERBY_PROPERTY');
        userQuery.orderBy('o_ORDERBY_PROPERTY', OrderByEnum.ASC);

        const options: PaginationOptions = {
            orderByOptions: {},
            paginationOptions: {
                page: query.page ?? 1,
                limit: query.limit ?? 25,
                paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                countQueries: false,
            },
        };

        const pagination = await paginate(userQuery, options.paginationOptions);

        if (pagination.items.length == 0) {
            throw new UsersNotFoundException();
        }

        const dto = this.mapper.mapArray(
            pagination.items,
            UserProfileDto,
            User,
        );
        return createPaginationObject<UserProfileDto>({
            items: dto,
            totalItems: totalItems,
            currentPage: pagination.meta.currentPage,
            limit: pagination.meta.itemsPerPage,
        });
    }
}
