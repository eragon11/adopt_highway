import { ApiProperty } from '@nestjs/swagger';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { District } from 'src/entities/district.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { User } from 'src/entities/user.entity';
import { SelectQueryBuilder } from 'typeorm';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { INVALID_AMERICAN_DATE } from 'src/constants/common.constants';

export type OrderByDirection = 'ASC' | 'DESC';

export enum OrderByEnum {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type OrderByOptions = {
    orderBy?: string;
    orderByDirection?: OrderByDirection;
};

export type PaginationOptions = {
    paginationOptions?: IPaginationOptions;
    orderByOptions?: OrderByOptions;
};

export type ReportOptions = {
    user: User;
    districtNumber: number;
    officeNumber: number;
    countyNumber: number;
    beginDate: Date;
    endDate: Date;
    options: PaginationOptions;
};

export type GroupInfoReportOptions = {
    user: User;
    beginDate: Date;
    endDate: Date;
    options: PaginationOptions;
};

export type TypeOrmOrderedField = {
    orderByField: string;
    isCalculated?: boolean;
};

// from typeorm
export async function countQuery<T>(
    queryBuilder: SelectQueryBuilder<T>,
): Promise<number> {
    const totalQueryBuilder = queryBuilder.clone();

    totalQueryBuilder
        .skip(undefined)
        .limit(undefined)
        .offset(undefined)
        .take(undefined);

    const { value } = await queryBuilder.connection
        .createQueryBuilder()
        .select('COUNT(*)', 'value')
        .from(`(${totalQueryBuilder.getQuery()})`, 'uniqueTableAlias')
        .setParameters(queryBuilder.getParameters())
        .getRawOne<{ value: string }>();

    return Number(value);
}

/**
 * Returns the district from a report role
 * @param options
 * @returns
 */
export function GetDistrictFromOptions(
    options: ReportOptions,
): District | undefined {
    const currentRole = options?.user?.currentRole;
    return currentRole.organization?.district ?? undefined;
}

/**
 *
 * @param options
 * @returns
 */
export function GetMaintenanceOfficeFromOptions(
    options: ReportOptions,
): MaintenanceSection | undefined {
    const roles = options?.user?.currentRole;
    return roles.organization?.maintenanceSection ?? undefined;
}

/**
 * Checks that a value is in the format MM/dd/yyyy and is a valid ate
 * @param validationOptions
 * @returns boolean, true when it is valid
 */
export function IsAmericanDate(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'IsAmericanDate',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: INVALID_AMERICAN_DATE,
                ...validationOptions,
            },
            validator: {
                validate(value: any) {
                    const regex =
                        /\b(0?[1-9]|1[012])([\/\-])(0?[1-9]|[12]\d|3[01])\2(\d{4})/;
                    return (
                        !value ||
                        (typeof value === 'string' && regex.test(value))
                    );
                },
            },
        });
    };
}

/**
 * Base Report Query DTO
 */
export abstract class BaseReportQueryDto {
    @IsAmericanDate({ message: 'beginDate must be in MM/dd/yyyy format' })
    @ApiProperty({ name: 'beginDate', type: Date, required: false })
    beginDate: Date;

    @IsAmericanDate({ message: 'endDate must be in MM/dd/yyyy format' })
    @ApiProperty({ name: 'endDate', type: Date, required: false })
    endDate: Date;

    @ApiProperty({
        name: 'orderByDirection',
        enum: OrderByEnum,
        default: OrderByEnum.DESC,
        required: false,
    })
    orderByDirection: OrderByDirection;

    @ApiProperty({
        name: 'page',
        default: 1,
        type: Number,
        required: false,
        minimum: 1,
    })
    page;

    @ApiProperty({
        name: 'limit',
        default: 10,
        type: Number,
        required: false,
        maximum: 100,
    })
    limit;
}
