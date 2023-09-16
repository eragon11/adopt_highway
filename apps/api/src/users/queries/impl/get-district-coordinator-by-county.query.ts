/**
 * Message to get the district coordinators for a given county numebr
 */
export class GetDistrictCoordinatorsForCountyNumberQuery {
    countyNumber: number;

    constructor(countyNumber: number) {
        this.countyNumber = countyNumber;
    }
}
