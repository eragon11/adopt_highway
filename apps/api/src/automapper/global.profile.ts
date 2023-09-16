import { Mapper, MappingProfile } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Global, Injectable } from '@nestjs/common';
import { DateConverter } from './converters/date.converter';

@Global()
@Injectable()
export default class GlobalAahProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }
    mapProfile(): MappingProfile {
        return (mapper) => {
            // trim all strings
            mapper.addTypeConverter(String, String, (str) =>
                str && str.length > 0 ? str.trim() : str,
            );
            mapper.addTypeConverter(Date, String, (date) =>
                DateConverter.convert(date),
            );
        };
    }
}
