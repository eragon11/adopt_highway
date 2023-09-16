import { Converter } from '@automapper/core';
import { Agreement } from 'src/entities/agreement.entity';

/**
 * Returns the renewal time frame enumerator
 */
export const AgreementMissedPickupsConverter: Converter<Agreement, number> = {
    convert(source: Agreement): number {
        const numberOfMissedPickups =
            (source.totalNumberOfScheduledPickupsPerAgreementTimeline ?? 0) -
            (source.totalNumberOfPickupsPerAgreementTimeline ?? 0);
        return numberOfMissedPickups < 0 ? 0 : numberOfMissedPickups;
    },
};
