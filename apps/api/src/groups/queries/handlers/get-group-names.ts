import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupSponsor } from 'src/entities';
import { OrderByEnum } from 'src/reports/utils';
import { Like, Repository } from 'typeorm';
import { GetGroupNamesQuery } from '../impl';

@QueryHandler(GetGroupNamesQuery)
export class GetGroupNames implements IQueryHandler<GetGroupNamesQuery> {
    constructor(
        @InjectRepository(GroupSponsor)
        private readonly repo: Repository<GroupSponsor>,
    ) {}

    async execute(query: GetGroupNamesQuery): Promise<string[]> {
        const groups = await this.repo.find({
            where: { name: Like(`%${query.groupName}%`) },
            take: 10,
            order: {
                name: OrderByEnum.ASC,
            },
        });

        if (groups.length == 0) {
            throw new NotFoundException(
                `There are no groups that have '${query.groupName}' in the name`,
            );
        }

        return groups.map((c) => c.name);
    }
}
