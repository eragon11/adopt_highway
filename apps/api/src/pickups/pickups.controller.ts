import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiQuery } from '@nestjs/swagger';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import RoleGuard from 'src/auth/guards/role.guard';
import {
    CAN_ADD_PICKUPS,
    CAN_DELETE_PICKUPS,
    CAN_UPDATE_PICKUPS,
} from 'src/common/permissions';
import { DeletePickupByIdCommand, UpdatePickupByIdCommand } from './commands';
import { InsertPickupByIdDto, UpdatePickupByIdDto } from './dtos';
import { InsertPickupByIdCommand } from './commands/impl/insert-pickup-by-id.command';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

@UseGuards(JwtAuthenticationGuard)
@Controller('pickups')
export class PickupsController {
    constructor(private readonly commandBus: CommandBus) {}

    @Patch('')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RoleGuard([...CAN_UPDATE_PICKUPS]))
    @ApiQuery({
        name: 'id',
        type: Number,
        description: 'Pickup id',
        required: true,
    })
    async updateById(
        @Query('id', new ParseIntPipe()) id,
        @Body() dto: UpdatePickupByIdDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<void> {
        const command: UpdatePickupByIdCommand = new UpdatePickupByIdCommand(
            id,
            dto.type,
            dto.pickupDate,
            dto.numberOfBagsCollected,
            dto.numberOfVolunteers,
            dto.comments,
            req.user,
        );
        await this.commandBus.execute(command);
    }

    @Delete('')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UseGuards(RoleGuard([...CAN_DELETE_PICKUPS]))
    @ApiQuery({
        name: 'id',
        type: Number,
        description: 'Pickup id',
        required: true,
    })
    async deleteById(
        @Query('id', new ParseIntPipe()) id,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ) {
        const command: DeletePickupByIdCommand = new DeletePickupByIdCommand(
            id,
            req.user,
        );
        await this.commandBus.execute(command);
    }

    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(RoleGuard([...CAN_ADD_PICKUPS]))
    @ApiQuery({
        name: 'agreementId',
        type: Number,
        description: 'Agreement id',
        required: true,
    })
    async insert(
        @Query('agreementId', new ParseIntPipe()) agreementId,
        @Body() dto: InsertPickupByIdDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<void> {
        const command: InsertPickupByIdCommand = new InsertPickupByIdCommand(
            agreementId,
            dto.type,
            dto.pickupDate,
            dto.numberOfBagsCollected,
            dto.numberOfVolunteers,
            dto.comments,
            req.user,
        );
        await this.commandBus.execute(command);
    }
}
