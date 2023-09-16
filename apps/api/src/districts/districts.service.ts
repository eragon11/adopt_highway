import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { District } from 'src/entities/district.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class DistrictsService {
    constructor(
        @InjectRepository(District)
        private readonly districtRepo: Repository<District>,
    ) {}

    public getAllDistricts: SelectQueryBuilder<District> = this.districtRepo
        .createQueryBuilder('d')
        .orderBy('d.NAME');

    async GetAll(): Promise<District[]> {
        return this.getAllDistricts.getMany();
    }

    /**
     * Returns the district for the county number
     * @param countyNumber
     * @returns {District}
     */
    public async GetDistrictForCountyNumber(
        countyNumber: number,
    ): Promise<District> {
        try {
            const district = await this.districtRepo
                .createQueryBuilder('d')
                .leftJoinAndSelect('d.counties', 'county')
                .where('county.NUMBER = :countyNumber', { countyNumber })
                .getOne();

            return district;
        } catch (error) {
            Logger.error(error.message, 'GetDistrictForCountyNumber');
            throw error;
        }
    }
}
