import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { County } from 'src/entities/county.entity';
import { CountiesService } from './counties.service';
import { ReportFilterQueryDto } from '../utils/query/report-filter-query.dto';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import RoleGuard from 'src/auth/guards/role.guard';
import { CAN_VIEW_COUNTIES } from 'src/common/permissions';
import { CountyDto } from './dto';
import { AllowAnonymous } from 'src/decorators';

@UseGuards(JwtAuthenticationGuard)
@Controller('counties')
export class CountyController {
    constructor(private readonly service: CountiesService) {}

    @UseGuards(JwtAuthenticationGuard)
    @UseGuards(RoleGuard([...CAN_VIEW_COUNTIES]))
    @Get()
    async index(
        @RequestUserWithCurrentRole() req: RequestWithUser,
        @Query() dto: ReportFilterQueryDto,
    ): Promise<County[]> {
        return this.service.GetAll(req, dto.districtNumber, dto.officeNumber);
    }

    @AllowAnonymous()
    @Get('/names')
    async names(): Promise<CountyDto[]> {
        const counties = await this.service.GetAllNames();
        return counties;
    }
}
