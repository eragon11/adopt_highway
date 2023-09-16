import { UserStatusEnum } from 'src/common/enum';
import { User } from 'src/entities';
import { CreateUserRoleDto } from 'src/users/dtos';

/**
 * DTO for creating a new user
 * We will add all needed fields for creating a user here
 */
export class CreateUserCommand {
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
    roles: CreateUserRoleDto[];
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
        roles: CreateUserRoleDto[],
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
        this.roles = roles;
        this.currentUser = currentUser;
    }
}
