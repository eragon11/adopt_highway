import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsInt } from 'class-validator';
import { Roles, UserStatusEnum } from 'src/common/enum';
import { User } from 'src/entities';

/**
 * Role DTO for GetUserDto
 */
export class GetUserProfileRoleDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    @IsEnum(Roles)
    roleType: Roles;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    districtNumber: number;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    officeNumber: number;

    constructor(
        id: number,
        roleType: Roles,
        districtNumber: number,
        officeNumber: number,
    ) {
        this.id = id;
        this.roleType = roleType;
        this.districtNumber = districtNumber;
        this.officeNumber = officeNumber;
    }
}

/**
 * DTO for a GET /users/profile request
 */
export class GetUserProfileDto {
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
    roles: GetUserProfileRoleDto[];
    currentUser: User;
    fullName: string;

    constructor(
        id: number,
        firstName: string,
        lastName: string,
        fullName: string,
        userName: string,
        email: string,
        contactNumber: string,
        status: UserStatusEnum,
        address1: string,
        address2: string,
        city: string,
        state: string,
        postalCode: string,
        roles: GetUserProfileRoleDto[],
        currentUser: User,
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userName = userName;
        this.fullName = `${firstName} ${lastName}`;
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
