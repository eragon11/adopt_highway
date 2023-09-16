import { Mapper } from '@automapper/core';
import { IQueryHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';

import {
    IPaginationOptions,
    Pagination,
    IPaginationMeta,
    paginate,
    createPaginationObject,
} from 'nestjs-typeorm-paginate';
import { OrderByDirection, OrderByEnum, countQuery } from 'src/reports/utils';
import { SelectQueryBuilder, Repository } from 'typeorm';

export interface FilterProperties {
    districtNumber?: number;
    officeNumber?: number;
    countyNumber?: number;
    groupName?: string;
}

export abstract class BaseSortableQuery<T> {
    orderByDirection: OrderByDirection;
    page: number;
    limit: number;
    abstract orderBy: keyof T;

    getPaginationOptions = (): IPaginationOptions => {
        const options: IPaginationOptions = {
            limit: this.limit,
            page: this.page,
            countQueries: false,
        };

        return options;
    };
}

/**
 * Base Sortable Query DTO
 */
export abstract class BaseSortableQueryDto<T> {
    @ApiProperty({
        name: 'orderByDirection',
        enum: OrderByEnum,
        default: OrderByEnum.DESC,
        required: true,
    })
    orderByDirection: OrderByDirection;

    @ApiProperty({
        name: 'page',
        default: 1,
        type: Number,
        required: false,
        minimum: 1,
    })
    page: number;

    @ApiProperty({
        name: 'limit',
        default: 10,
        type: Number,
        required: false,
        maximum: 10,
    })
    limit: number;

    @ApiProperty({
        name: 'orderBy',
        required: false,
        enum: [],
    })
    abstract orderBy: keyof T;
}

/**
 * Abstract class for sorting queries
 */
export abstract class BaseSortableQueryHandler<
    T extends BaseSortableQuery<TDto>,
    TDto,
    TEntity,
> implements IQueryHandler<T, Pagination<TDto>>
{
    protected selectQueryBuilder: SelectQueryBuilder<TEntity>;

    constructor(
        protected readonly repository: Repository<TEntity>,
        protected readonly mapper: Mapper,
    ) {}

    protected async getCountQuery(
        sqb: SelectQueryBuilder<TEntity>,
    ): Promise<number> {
        return countQuery<TEntity>(sqb);
    }

    protected async getSortedQb(
        sortField: string,
        sqb: SelectQueryBuilder<TEntity>,
        query: T,
    ) {
        return sqb
            .addSelect(sortField, 'o_ORDER_PROPERTY')
            .orderBy('o_ORDER_PROPERTY', query.orderByDirection);
    }

    protected async getPagination(
        sortedQb: SelectQueryBuilder<TEntity>,
        query: T,
    ): Promise<Pagination<TEntity, IPaginationMeta>> {
        return paginate(sortedQb, query.getPaginationOptions());
    }

    getReturnObject<TDto>(
        pagination: Pagination<TEntity, IPaginationMeta>,
        totalItems: number,
    ) {
        const dto: TDto[] = this.mapDto(pagination) as unknown as TDto[];
        return createPaginationObject<TDto>({
            items: dto,
            totalItems: totalItems,
            currentPage: pagination.meta.currentPage,
            limit: pagination.meta.itemsPerPage,
        });
    }

    abstract mapDto(pagination: Pagination<TEntity, IPaginationMeta>): TDto[];

    abstract getSelectQueryBuilder(query: T): SelectQueryBuilder<TEntity>;

    /**
     * Derived classes must implement a method to convert the request order by to a SQL column for sorting
     * @param {string} orderBy property name (keyof) of the field to be sorted on the DTO
     * @returns {string}  SQL alias and column name (e.g. 't.COLUMN_NAME')
     */
    abstract getSort(orderBy: string): string;

    /**
     * Derived classes must implement a method to execute the query of type T
     * @param {T} query message containing the GET request parameters of T that extends BaseSortableQuery
     * @returns {Promise<Pagination<TDto>>}  sorted query results
     */
    abstract execute(query: T): Promise<Pagination<TDto>>;
}

/**
 * Adds district number, county number, office number and group name filters
 */
export abstract class BaseFilterAndSortableQuery<
    T,
> extends BaseSortableQuery<T> {
    districtNumber: number;
    officeNumber: number;
    countyNumber: number;
    groupName: string;

    constructor(
        districtNumber: number,
        officeNumber: number,
        countyNumber: number,
        groupName: string,
    ) {
        super();
        this.districtNumber = districtNumber;
        this.officeNumber = officeNumber;
        this.countyNumber = countyNumber;
        this.groupName = groupName;
    }
}

/**
 * Query DTO used by the controller method including filters for district number, county number, office number, and groupName
 */
export abstract class BaseFilterAndSortableQueryDto<T>
    extends BaseSortableQueryDto<T>
    implements FilterProperties
{
    @ApiProperty({
        name: 'districtNumber',
        type: Number,
        required: false,
        minimum: 1,
        maximum: 35,
    })
    districtNumber: number;

    @ApiProperty({
        name: 'officeNumber',
        type: Number,
        required: false,
        minimum: 1,
        maximum: 254,
    })
    officeNumber: number;

    @ApiProperty({
        name: 'countyNumber',
        type: Number,
        required: false,
        minimum: 1,
        maximum: 254,
    })
    countyNumber: number;

    @ApiProperty({
        name: 'groupName',
        type: String,
        required: false,
        maxLength: 50,
    })
    groupName: string;
}
