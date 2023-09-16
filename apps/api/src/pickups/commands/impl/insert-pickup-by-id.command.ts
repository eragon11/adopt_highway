import { PickupType } from 'src/common';
import { User } from 'src/entities';

/**
 * Inserts a pickup by id
 */
export class InsertPickupByIdCommand {
    agreementId: number;
    type: PickupType;
    pickupDate: Date;
    numberOfBagsCollected: number;
    numberOfVolunteers: number;
    comments: string;
    currentUser: User;

    constructor(
        agreementId: number,
        pickupType: PickupType,
        actualPickupDate: Date,
        actualNumberOfBagsCollected: number,
        actualNumberOfVolunteers: number,
        pickupComments: string,
        currentUser: User,
    ) {
        this.agreementId = agreementId;
        this.currentUser = currentUser;
        this.type = pickupType;
        this.pickupDate = actualPickupDate;
        this.numberOfBagsCollected = actualNumberOfBagsCollected;
        this.numberOfVolunteers = actualNumberOfVolunteers;
        this.comments = pickupComments;
    }
}
