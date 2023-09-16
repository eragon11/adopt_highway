import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePickupByIdCommand } from '../impl';
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

@CommandHandler(DeletePickupByIdCommand)
export class DeletePickupByIdHandler
    implements ICommandHandler<DeletePickupByIdCommand>
{
    private readonly logger: Logger = new Logger(DeletePickupByIdCommand.name);
    constructor(
        @InjectRepository(Pickup)
        private readonly pickupRepo: Repository<Pickup>,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    /**
     * Deletes a command using the message provided
     * @param {DeletePickupByIdCommand} command
     * @returns {Pickup}
     */
    async execute(command: DeletePickupByIdCommand): Promise<void> {
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

        await this.pickupRepo
            .delete(id)
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
                    `Could not delete pickup with ID ${id}`,
                );
            });

        return;
    }
}
