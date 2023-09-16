import { User } from 'src/entities';

/**
 * Message to get one available segment by Id
 */
export class GetAvailableSegmentByIdQuery {
    segmentId: string;
    currentUser: User;

    constructor(segmentId: string, currentUser: User) {
        this.segmentId = segmentId;
        this.currentUser = currentUser;
    }
}
