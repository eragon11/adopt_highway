import { ApiProperty } from '@nestjs/swagger';

export abstract class PaginationDto {
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

export abstract class BasePaginationDto {
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
        maximum: 100,
    })
    limit: number;

    constructor(page: number, limit: number) {
        this.page = page;
        this.limit = limit;
    }
}
