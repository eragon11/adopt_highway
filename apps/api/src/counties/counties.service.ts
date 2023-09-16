import { InjectMapper } from '@automapper/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { County } from 'src/entities/county.entity';
import RoleSecuredService from 'src/roles/role-secured.service';
import { Repository } from 'typeorm';
import { CountyDto } from './dto';

@Injectable()
export class CountiesService extends RoleSecuredService {
    private readonly logger = new Logger(CountiesService.name);
    constructor(
        @InjectMapper() private readonly mapper,
        @InjectRepository(County)
        private readonly countyRepo: Repository<County>,
        authService: AuthService,
    ) {
        super(authService);
    }

    /**
     * Returns the counties available for the districtNumber and officeNumber
     *
     * @param districtNumber number of the district
     * @param officeNumber number of the maintenance office
     * @returns all counties with that district/maintenance office combination
     */
    async GetAll(
        req: RequestWithUser,
        districtNumber: number,
        officeNumber: number,
    ): Promise<County[]> {
        try {
            await this.checkParamsForRole(req, districtNumber, officeNumber);

            let query = this.countyRepo.createQueryBuilder('c');
            if (districtNumber && officeNumber) {
                query = this.countyRepo
                    .createQueryBuilder('c')
                    .leftJoin('c.maintenanceSections', 'm')
                    .andWhere(
                        'm.DISTRICT_NUMBER = :districtNumber AND m.NUMBER = :officeNumber',
                        {
                            districtNumber,
                            officeNumber,
                        },
                    )
                    .orderBy('c.NAME');
            } else if (districtNumber) {
                query = this.countyRepo
                    .createQueryBuilder('c')
                    .leftJoin('c.districts', 'district')
                    .andWhere('district.NUMBER = :districtNumber', {
                        districtNumber,
                    })
                    .orderBy('c.NAME');
            }

            return query.getMany();
        } catch (error) {
            this.logger.error(error.message, 'CountyService');
            throw error;
        }
    }

    async GetAllNames(): Promise<CountyDto[] | PromiseLike<CountyDto[]>> {
        try {
            const query = await this.countyRepo
                .createQueryBuilder('c')
                .orderBy('c.NAME')
                .where("c.NAME NOT LIKE '%UNKNOWN%'")
                .getMany();
            const mapped = this.mapper.mapArray(query, CountyDto, County);
            return mapped;
        } catch (error) {
            this.logger.error(error.message, 'CountyService');
            throw error;
        }
    }

    /**
     * Returns a county by its number
     * @param {number} countyNumber the county's number (1-254)
     * @returns {County} County that matches the number
     */
    async GetByNumber(countyNumber: number): Promise<County> {
        try {
            return await this.countyRepo.findOne({
                number: countyNumber,
            });
        } catch (error) {
            this.logger.error(error.message);
            throw error;
        }
    }
}
