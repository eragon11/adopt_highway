import { Mapper, MappingProfile, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Segment } from 'src/entities';
import { GetSegmentNameDto } from '../dto';

export class SegmentMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(Segment, GetSegmentNameDto)
                .forMember(
                    (destination: GetSegmentNameDto) =>
                        destination.aahSegmentId,
                    mapFrom((src: Segment) => src.aahSegmentId),
                )
                .forMember(
                    (destination: GetSegmentNameDto) =>
                        destination.aahRouteName,
                    mapFrom((src: Segment) => src.aahRouteName),
                )
                .forMember(
                    (destination: GetSegmentNameDto) =>
                        destination.countyNumber,
                    mapFrom((src: Segment) => src.countyNumber),
                )
                .forMember(
                    (destination: GetSegmentNameDto) =>
                        destination.segmentLengthMiles,
                    mapFrom((src: Segment) => src.segmentLengthMiles),
                );
        };
    }
}
