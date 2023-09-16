import {
    Controller,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import RoleGuard from 'src/auth/guards/role.guard';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';
import { CAN_VIEW_MAINTENANCE_OFFICES } from 'src/common/permissions';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import { MaintenanceSection } from 'src/entities/maintenancesection.entity';
import { MaintenanceSectionService } from './maintenance-section.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('maintenance-sections')
export class MaintenanceSectionController {
    constructor(private readonly service: MaintenanceSectionService) {}

    @ApiProperty({
        name: 'districtNumber',
        type: Number,
        minimum: 1,
        maximum: 25,
        required: true,
        description: 'TxDOT District Number',
    })
    @Get()
    @UseGuards(RoleGuard([...CAN_VIEW_MAINTENANCE_OFFICES]))
    async index(
        @RequestUserWithCurrentRole() req: RequestWithUser,
        @Query('districtNumber', new DefaultValuePipe(1), ParseIntPipe)
        districtNumber: number,
    ): Promise<MaintenanceSection[]> {
        return this.service.GetAll(req, districtNumber);
    }
}
