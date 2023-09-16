import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * TypeOrm can update an entity with a partial set of properties.
 * This function takes an object containing a subset of properties
 * @param obj any object that contains keys of the
 * @returns a partial entity without undefined properties
 */
export function ConvertObjectToPartialEntity<T>(
    obj: any,
): QueryDeepPartialEntity<T> {
    // Update needs a partial of our application
    const partial: QueryDeepPartialEntity<T> = {} as T;

    // remove any undefined properties, assign populated ones
    Object.keys(obj).forEach((key) => {
        // return populated object
        if (obj[key] !== undefined) {
            partial[key] = obj[key];
        } else {
            delete partial[key];
        }
    });

    return partial;
}
