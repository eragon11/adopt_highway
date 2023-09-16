import { mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { County } from 'src/entities';
import { CountyDto } from '../dto';

export class CountyMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(County, CountyDto)
                .forMember(
                    (dest) => dest.number,
                    mapFrom((src) => src.number),
                )
                .forMember(
                    (dest) => dest.name,
                    mapFrom((src) => src.name),
                );
        };
    }
}
