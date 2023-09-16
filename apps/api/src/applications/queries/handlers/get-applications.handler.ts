import { Mapper } from '@automapper/core';
import {
    countQuery,
    PaginationOptions,
} from '../../../reports/utils/report.utils';
import {
    Pagination,
    createPaginationObject,
    PaginationTypeEnum,
    paginateRawAndEntities,
} from 'nestjs-typeorm-paginate';
import { InjectMapper } from '@automapper/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Application } from '../../entities/application.entity';
import { GetApplicationsQuery } from '../impl/get-applications.query';
import { ApplicationsDto } from './../../dto/applications.dto';
import { ApplicationsService } from '../../applications.service';
import { ApplicationsNotFoundException } from '../../exceptions/applications-notfound-exception';

@QueryHandler(GetApplicationsQuery)
export class GetApplicationsQueryHandler
    implements IQueryHandler<GetApplicationsQuery>
{
    constructor(
        @InjectMapper() private readonly mapper: Mapper,
        private readonly appService: ApplicationsService,
    ) {}

    /**
     * Returns
     * @param { GetApplicationsQuery } query
     * @returns  all applications for the query provided
     */

    async execute(
        query: GetApplicationsQuery,
    ): Promise<Pagination<ApplicationsDto>> {
        try {
            const applicationsQuery =
                this.appService.findAllAppsWithParams(query);

            // get the total count
            const totalApplications = await countQuery<Application>(
                applicationsQuery,
            );
            // set the ordering
            applicationsQuery
                .orderBy('NOT_MODIFIED_2WKS', 'DESC')
                .addOrderBy('OLDER_30DAYS', 'DESC')
                .addOrderBy('SORT_CREATED_BY', 'DESC');

            if (!applicationsQuery) {
                throw new NotFoundException();
            }

            const options: PaginationOptions = {
                orderByOptions: {},
                paginationOptions: {
                    page: query.page ?? 1,
                    limit: query.limit ?? 25,
                    paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
                    countQueries: false,
                },
            };

            // FROM: https://github.com/nestjsx/nestjs-typeorm-paginate#raw-and-entities
            const [pagination, rawResults] = await paginateRawAndEntities(
                applicationsQuery,
                options.paginationOptions,
            );

            // add the results from the CASE to the returned object
            pagination.items.forEach((item) => {
                const rawResult: any = rawResults.find(
                    (raw: any) => raw.app_APPLICATION_ID === item.id,
                );
                item.notModified2Wks = rawResult?.NOT_MODIFIED_2WKS;
                item.older30Days = rawResult?.OLDER_30DAYS;
                item.districtId = rawResult?.DISTRICT_ID;
                item.districtName = rawResult?.DISTRICT_NAME;
                item.districtNumber = rawResult?.DISTRICT_NUMBER;
            });

            if (pagination.items.length == 0) {
                throw new ApplicationsNotFoundException();
            }

            const dto = this.mapper.mapArray(
                pagination.items,
                ApplicationsDto,
                Application,
            );

            return createPaginationObject<ApplicationsDto>({
                items: dto,
                totalItems: totalApplications,
                currentPage: pagination.meta.currentPage,
                limit: pagination.meta.itemsPerPage,
            });
        } catch (err) {
            throw err;
        }
    }
}
