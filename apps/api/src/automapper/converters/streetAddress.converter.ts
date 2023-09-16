import { Converter } from '@automapper/core';
import { Address } from 'src/entities/address.entity';

/**
 * Returns lines one and two of an Address object
 */
export const StreetAddressConverter: Converter<Address, string> = {
    convert(source: Address): string {
        return `${source?.addressLine1 ?? ''} ${
            source?.addressLine2 ?? ''
        }`.trim();
    },
};
