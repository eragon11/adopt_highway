import { User } from 'src/entities';

/**
 * Message to get the district coordinators for a given segment
 */
export class GetDistrictCoordinatorsForSegmentQuery {
    segmentId: string;
    currentUser: User;

    constructor(segmentId: string, currentUser: User) {
        this.segmentId = segmentId;
        this.currentUser = currentUser;
    }
}
