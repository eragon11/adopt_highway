import { Converter } from '@automapper/core';
import { Agreement } from 'src/entities/agreement.entity';
import { AgreementRenewalTimeframe } from 'src/reports/utils/enum';

/**
 * Returns the renewal time frame enumerator
 */
export const AgreementRenewalTimeframeConverter: Converter<Agreement, string> =
    {
        convert(source: Agreement): string {
            const diffInMs = Math.abs(source.endDate.getDate() - Date.now());
            const days = diffInMs / (1000 * 60 * 60 * 24);
            switch (true) {
                case days < 31:
                    return AgreementRenewalTimeframe.next30days;
                case days > 30 && days < 61:
                    return AgreementRenewalTimeframe.in31to60Days;
                default:
                    return AgreementRenewalTimeframe.after60days;
            }
        },
    };
