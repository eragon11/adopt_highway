import { Transform } from 'class-transformer';

/**
 * Transforms an ApiProperty string value to a boolean
 * @returns boolean of the ApiProperty
 */
export function ToBoolean(): (target: any, key: string) => void {
    return Transform((target: any) => {
        return (
            target.value === 'true' ||
            target.value === true ||
            target.value === 1 ||
            target.value === '1'
        );
    });
}
