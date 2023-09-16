import { Converter } from '@automapper/core';
import { Segment } from 'src/entities/segment.entity';

// returns a string with the AAH route name, or the TxDOT route, if not available
export const RouteNameConverter: Converter<Segment, string> = {
    convert(source: Segment): string {
        return source?.aahRouteName ?? source?.txdotRouteName ?? 'None';
    },
};
