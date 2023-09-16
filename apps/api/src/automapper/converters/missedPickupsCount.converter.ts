import { Converter } from '@automapper/core';
import { Pickup } from 'src/entities/pickup.entity';

// returns a string from now back to the first contract date - example: '10 years ago', 'a month ago', 'five weeks ago'
// returns None if we have no initial contact date, nor a begin date
export const MissedPickupsCountConverter: Converter<Pickup, number> = {
    convert(source: Pickup): number {
        const difference =
            source.scheduledPickupCount - source.totalPickupCount;
        return difference > 0 ? difference : 0;
    },
};
