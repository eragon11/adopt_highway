import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdatePickupByIdCommand } from '../impl';
import { InjectRepository } from '@nestjs/typeorm';
import { Agreement, Pickup, Segment, ViewRoleSegment } from 'src/entities';
import { Repository } from 'typeorm';
import {
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ConvertObjectToPartialEntity } from 'src/utils';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@CommandHandler(UpdatePickupByIdCommand)
export class UpdatePickupByIdHandler
    implements ICommandHandler<UpdatePickupByIdCommand>
{
    private readonly logger: Logger = new Logger(UpdatePickupByIdHandler.name);
    constructor(
        @InjectRepository(Pickup)
        private readonly pickupRepo: Repository<Pickup>,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    /**
     * Updates a command using the message provided
     * @param {UpdatePickupByIdCommand} command
     * @returns {Pickup}
     */
    async execute(command: UpdatePickupByIdCommand): Promise<void> {
        const id = command.pickupId;

        const pickup = this.pickupRepo
            .createQueryBuilder('p')
            .innerJoin(Agreement, 'a', 'p.AGREEMENT_ID = a.AGREEMENT_ID')
            .innerJoin(
                Segment,
                's',
                'CAST(a.AAH_SEGMENT_GLOBAL_ID as VARCHAR(255)) = CAST(s.GlobalID AS VARCHAR(255))',
            )
            .innerJoin(ViewRoleSegment, 'rs', 'rs.GlobalId = s.GlobalID')
            .where('p.PICKUP_ID = :pickupId AND rs.ROLE_ID = :currentRole', {
                pickupId: command.pickupId,
                currentRole: command.currentUser.currentRole.id,
            });

        if (!pickup) {
            throw new NotFoundException(
                `Could not find a pickup with an ID: ${command.pickupId}`,
            );
        }

        const partial: Pickup = this.mapper.map(
            command,
            Pickup,
            UpdatePickupByIdCommand,
        );
        // Update needs a partial of our pickup
        const update: QueryDeepPartialEntity<Pickup> =
            ConvertObjectToPartialEntity<Pickup>(partial);

        await this.pickupRepo
            .update(id, update)
            .then((result) => {
                switch (result.affected) {
                    case 0:
                        throw new NotFoundException(
                            `Could not find a pickup with ID: ${id}`,
                        );
                    default:
                        break;
                }
            })
            .catch((err) => {
                if (err.status !== 500) throw err;
                this.logger.error(err);
                throw new InternalServerErrorException(
                    `Could not update pickup with ID ${id}`,
                );
            });

        return;
    }
}
