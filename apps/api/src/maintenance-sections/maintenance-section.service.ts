import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { District } from 'src/entities/district.entity';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import RoleSecuredService from 'src/roles/role-secured.service';
import { Repository } from 'typeorm';

@Injectable()
export class MaintenanceSectionService extends RoleSecuredService {
    constructor(
        @InjectRepository(MaintenanceSection)
        readonly repo: Repository<MaintenanceSection>,
        authService: AuthService,
    ) {
        super(authService);
    }

    async GetAll(
        req: RequestWithUser,
        districtNumber: number,
    ): Promise<MaintenanceSection[]> {
        try {
            await this.checkParamsForRole(req, districtNumber, null);
            return this.repo
                .createQueryBuilder('ms')
                .leftJoinAndMapOne(
                    's.district',
                    District,
                    'd',
                    'ms.DISTRICT_ID = d.DISTRICT_ID',
                )
                .where('d.number = :districtNumber', { districtNumber })
                .orderBy('ms.NAME')
                .getMany();
        } catch (error) {
            Logger.error(error.message, 'MaintenanceSectionService');
            throw error;
        }
    }
}
