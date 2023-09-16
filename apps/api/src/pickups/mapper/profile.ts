import { Mapper, MappingProfile, ignore, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { UpdatePickupByIdCommand } from '../commands';
import { Pickup } from 'src/entities';
import { InsertPickupByIdCommand } from '../commands/impl/insert-pickup-by-id.command';

@Injectable()
export class PickupMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(UpdatePickupByIdCommand, Pickup)
                .forMember((dest) => dest.id, ignore())
                .forMember(
                    (dest) => dest.type,
                    mapFrom((src) => src.type),
                )
                .forMember(
                    (dest) => dest.comments,
                    mapFrom((src) => src.comments),
                )
                .forMember(
                    (dest) => dest.bagFillQuantity,
                    mapFrom((src) => src.numberOfBagsCollected),
                )
                .forMember(
                    (dest) => dest.volunteerCount,
                    mapFrom((src) => src.numberOfVolunteers),
                );

            mapper
                .createMap(InsertPickupByIdCommand, Pickup)
                .forMember((dest) => dest.id, ignore())
                .forMember(
                    (dest) => dest.actualPickupDate,
                    mapFrom((src) => new Date(src.pickupDate)),
                )
                .forMember(
                    (dest) => dest.type,
                    mapFrom((src) => src.type),
                )
                .forMember(
                    (dest) => dest.comments,
                    mapFrom((src) => src.comments),
                )
                .forMember(
                    (dest) => dest.bagFillQuantity,
                    mapFrom((src) => src.numberOfBagsCollected),
                )
                .forMember(
                    (dest) => dest.volunteerCount,
                    mapFrom((src) => src.numberOfVolunteers),
                );
        };
    }
}
