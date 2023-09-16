import { PickupType } from 'src/common';
import { User } from 'src/entities';

/**
 * Updates a pickup by id
 */
export class UpdatePickupByIdCommand {
    pickupId: number;
    type?: PickupType;
    pickupDate?: string;
    numberOfBagsCollected?: number;
    numberOfVolunteers?: number;
    comments?: string;
    currentUser: User;

    constructor(
        pickupId: number,
        pickupType: PickupType,
        actualPickupDate: string,
        actualNumberOfBagsCollected: number,
        actualNumberOfVolunteers: number,
        pickupComments: string,
        currentUser: User,
    ) {
        this.pickupId = pickupId;
        this.currentUser = currentUser;

        if (pickupType !== undefined) this.type = pickupType;
        if (actualPickupDate !== undefined) this.pickupDate = actualPickupDate;
        if (actualNumberOfBagsCollected !== undefined)
            this.numberOfBagsCollected = actualNumberOfBagsCollected;
        if (actualNumberOfVolunteers !== undefined)
            this.numberOfVolunteers = actualNumberOfVolunteers;
        if (pickupComments !== undefined) this.comments = pickupComments;
    }
}
