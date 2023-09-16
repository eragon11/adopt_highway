import { User } from 'src/entities';

/**
 * Deletes a pickup by id
 */
export class DeletePickupByIdCommand {
    pickupId: number;
    currentUser: User;

    constructor(pickupId: number, currentUser: User) {
        this.pickupId = pickupId;
        this.currentUser = currentUser;
    }
}
