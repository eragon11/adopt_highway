import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertPickupByIdCommand } from '../impl';
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

@CommandHandler(InsertPickupByIdCommand)
export class InsertPickupByIdHandler
    implements ICommandHandler<InsertPickupByIdCommand>
{
    private readonly logger: Logger = new Logger(InsertPickupByIdHandler.name);
    constructor(
        @InjectRepository(Agreement)
        private readonly agreementRepo: Repository<Agreement>,
        @InjectRepository(Pickup)
        private readonly pickupRepo: Repository<Pickup>,
        @InjectMapper()
        private readonly mapper: Mapper,
    ) {}

    /**
     * Inserts a command using the message provided
     * @param {InsertPickupByIdCommand} command
     * @returns {Pickup}
     */
    async execute(command: InsertPickupByIdCommand): Promise<void> {
        const partial: Pickup = this.mapper.map(
            command,
            Pickup,
            InsertPickupByIdCommand,
        );

        const agreement = await this.agreementRepo
            .createQueryBuilder('a')
            .innerJoin(
                Segment,
                's',
                'CAST(a.AAH_SEGMENT_GLOBAL_ID as VARCHAR(255)) = CAST(s.GlobalID AS VARCHAR(255))',
            )
            .innerJoin(ViewRoleSegment, 'rs', 'rs.GlobalId = s.GlobalID')
            .where(
                'a.AGREEMENT_ID = :agreementId AND rs.ROLE_ID = :currentRole',
                {
                    agreementId: command.agreementId,
                    currentRole: command.currentUser.currentRole.id,
                },
            )
            .getOne();

        if (!agreement) {
            throw new NotFoundException(
                `Could not find a agreement with an ID: ${command.agreementId}`,
            );
        }

        // Insert needs a partial of our pickup
        partial.agreement = agreement;

        await this.pickupRepo.save(partial).catch((err) => {
            if (err.status !== 500) throw err;
            this.logger.error(err);
            throw new InternalServerErrorException(
                `Could not Insert pickup for agreement with ID ${command.agreementId}`,
            );
        });
    }
}
