import * as dotenv from 'dotenv';
import findConfig from 'find-config';

dotenv.config({ path: findConfig('.env') });

import { Converter } from '@automapper/core';
import { InternalServerErrorException } from '@nestjs/common';
import { DateArrayToStringArrayMmDdYyyyConverter } from 'src/automapper';
import { DocumentStatus, NoDataEnum } from 'src/common';
import { Agreement, PickupSchedule } from 'src/entities';

export const RemainingPickupsFromYearMonthStringConverter: Converter<
    PickupSchedule[],
    number
> = {
    convert(source?: PickupSchedule[]): number {
        if (!source || source?.length === 0) {
            return 0;
        }

        const dates = source.map((ps: PickupSchedule) => {
            const c = ps.scheduledPickupYearMonth;
            const regex = /\d{4}\/\d{1,2}/;
            if (ps.scheduledPickupYearMonth.match(regex)) {
                throw new InternalServerErrorException(
                    'The pickups scheduled year month field was not the correct format',
                );
            }
            const year: number = parseInt(c.split('/')[1], 10);
            const month: number = parseInt(c.split('/')[0], 10);
            return new Date(year, month, 1);
        });

        if (dates.length === 0) {
            return 0;
        }

        return dates.filter((c: Date) => c > new Date()).length ?? 0;
    },
};

export const NextScheduledPickupDateConverter: Converter<
    PickupSchedule[],
    string
> = {
    convert(source?: PickupSchedule[]): string {
        if (!source || source.length === 0) {
            return NoDataEnum.None;
        }

        const dates = source.map((ps: PickupSchedule) => {
            const c = ps.scheduledPickupYearMonth;
            const regex = /\d{4}\/\d{1,2}/;
            if (ps.scheduledPickupYearMonth.match(regex)) {
                throw new InternalServerErrorException(
                    'The pickups scheduled year month field was not the correct format',
                );
            }
            const year: number = parseInt(c.split('/')[1], 10);
            const month: number = parseInt(c.split('/')[0], 10);
            return new Date(year, month, 1);
        });

        if (dates.length === 0) {
            return 'None';
        }

        const futureDates = dates
            .filter((d) => d && new Date(d).getTime() > Date.now())
            .sort((a, b) => a?.getTime() + b?.getTime());

        return futureDates[0]?.toLocaleDateString('en-us') ?? 'None';
    },
};

/**
 * Returns the next four pickup scheduled dates sorted in chronological order
 */
export const NextFourPickupScheduleDatesConverter: Converter<
    Agreement,
    string[]
> = {
    convert: function (src: Agreement): string[] {
        if (!src || !src.pickupSchedules || src.pickupSchedules.length === 0) {
            return [];
        }

        const dates = src.pickupSchedules?.map(
            (s: PickupSchedule) => s?.scheduledPickupDate,
        );

        dates.filter((d) => d !== undefined && d !== null);
        const sorted = dates
            .sort((a, b) => a?.getTime() - b?.getTime())
            .slice(0, 4);

        const returnValue =
            DateArrayToStringArrayMmDdYyyyConverter.convert(sorted);

        return returnValue;
    },
};

export const GetDocumentUrlConverter: Converter<Agreement, string> = {
    convert: function (src: Agreement): string {
        const document = src.documents?.filter((doc) =>
            [DocumentStatus.Signed, DocumentStatus.Completed].includes(
                doc.status,
            ),
        )[0];

        if (!document) {
            return null;
        }

        return `${process.env.MULESOFT_SIGNED_AGREEMENT_URL}/${src.agreementId}`;
    },
};
