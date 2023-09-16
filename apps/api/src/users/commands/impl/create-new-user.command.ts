import { Roles, UserStatusEnum } from 'src/common';
import { User } from 'src/entities';

export class CreateNewUserCommand {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    contactNumber: string;
    status: UserStatusEnum;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    role: Roles;
    currentUser: User;

    constructor(
        firstName: string,
        lastName: string,
        userName: string,
        email: string,
        contactNumber: string,
        status: UserStatusEnum,
        address1: string,
        address2: string,
        city: string,
        state: string,
        postalCode: string,
        role: Roles,
        currentUser: User,
    ) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.email = email;
        this.contactNumber = contactNumber;
        this.status = status;
        this.address1 = address1;
        this.address2 = address2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.role = role;
        this.currentUser = currentUser;
    }
}
