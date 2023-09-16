import { Converter } from '@automapper/core';
import { Agreement } from '../../entities/agreement.entity';
import moment from 'moment';

// returns a string from now back to the first contract date - example: '10 years ago', 'a month ago', 'five weeks ago'
// returns None if we have no initial contact date, nor a begin date
export const AgreementLengthInProgramConverter: Converter<Agreement, string> = {
    convert(source: Agreement): string {
        const beginDate =
            source.groupSponsor?.initialContactDate || source.beginDate;
        if (!beginDate) {
            return 'None';
        }
        return moment(beginDate).fromNow();
    },
};
