import { Controller, Get, UseGuards } from '@nestjs/common';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { CAN_VIEW_DISTRICTS } from 'src/common/permissions';
import { District } from 'src/entities/district.entity';
import { DistrictsService } from './districts.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('districts')
export class DistrictsController {
    constructor(private readonly service: DistrictsService) {}

    @UseGuards(RoleGuard([...CAN_VIEW_DISTRICTS]))
    @Get()
    async index(): Promise<District[]> {
        return this.service.GetAll();
    }
}
