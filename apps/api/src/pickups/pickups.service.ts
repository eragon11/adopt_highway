import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IPaginationOptions,
    paginate,
    Pagination,
} from 'nestjs-typeorm-paginate';
import { Pickup } from 'src/entities/pickup.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PickupsService {
    constructor(
        @InjectRepository(Pickup) private pickupRepo: Repository<Pickup>,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    async findAllPickups(
        options: IPaginationOptions,
    ): Promise<Pagination<Pickup>> {
        const pickups = this.pickupRepo.createQueryBuilder('p');
        return paginate<Pickup>(pickups, options);
    }
}
