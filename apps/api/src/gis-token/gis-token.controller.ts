import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { GisTokenService } from './gis-token.service';

@UseGuards(JwtAuthenticationGuard)
@Controller('gis-token')
export class GisTokenController {
    constructor(private readonly gisTokenService: GisTokenService) {}

    @ApiQuery({
        name: 'appUrl',
        type: String,
        description: 'The url of the application requesting the token',
        required: true,
    })
    @Get('')
    async index(@Query('appUrl') appUrl: string) {
        const options = { appUrl };
        return await this.gisTokenService.getAuthenticationToken(options);
    }
}
