import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { Repository } from 'typeorm';
import { GetApplicationByTokensQuery } from '../impl/get-application-by-tokens.query';

@QueryHandler(GetApplicationByTokensQuery)
export class GetApplicationByTokensQueryHandler
    implements IQueryHandler<GetApplicationByTokensQuery>
{
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        @InjectRepository(Application)
        private readonly appRepo: Repository<Application>,
    ) {}

    async execute(query: GetApplicationByTokensQuery): Promise<Application> {
        try {
            Logger.debug(
                'executing application query to get an application by tokens',
                'GetApplicationByTokensQuery',
            );

            const application = await this.appRepo
                .createQueryBuilder('app')
                .where(
                    'app.APPLICATION_TOKEN = :applicationToken AND app.ACCESS_TOKEN = :accessToken',
                    {
                        applicationToken: query.applicationToken,
                        accessToken: query.accessToken,
                    },
                )
                .getOne();

            if (!application) {
                throw new NotFoundException();
            }

            return application;
        } catch (err) {
            throw err;
        }
    }
}
