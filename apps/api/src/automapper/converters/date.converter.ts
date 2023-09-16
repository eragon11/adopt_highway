import { Converter } from '@automapper/core';

// converter to make a local date string for our dates
export const DateConverter: Converter<Date, string> = {
    convert(source?: Date): string {
        return source?.toLocaleDateString() ?? 'None';
    },
};

// converts a date to YY-MM-DD formatted string
export const DateToYymmddConverter: Converter<Date, string> = {
    convert(source?: Date): string {
        return source?.toISOString().split('T')[0] ?? 'None';
    },
};

// Converts an array of dates to a string of dates in MM/DD/YYYY format
export const DateArrayToStringArrayMmDdYyyyConverter: Converter<
    Date[],
    string[]
> = {
    convert(source?: Date[]): string[] {
        // convert to ISO split and take the first part

        const sortedDates = source
            .filter((s) => s !== null)
            .sort((a, b) => a?.getTime() - b?.getTime());

        // format is in YYYY-MM-DD format
        const dates = sortedDates?.map((date: Date) =>
            date.toLocaleDateString('en-US'),
        );
        return dates ?? ['None'];
    },
};
