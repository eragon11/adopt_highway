import { Converter } from '@automapper/core';
import { Sign } from '../../entities/sign.entity';

// converter to make a local date string for our dates
export const SignTextConverter: Converter<Sign, string> = {
    convert(sign: Sign): string {
        return (
            (sign.line1 ?? '') +
            (sign.line2 ?? '') +
            (sign.line3 ?? '') +
            (sign.line4 ?? '')
        ).trim();
    },
};
