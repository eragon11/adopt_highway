import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsPostalCode,
    Matches,
    MaxLength,
    ValidateNested,
} from 'class-validator';
import { Roles, UserStatusEnum } from 'src/common/enum';
import {
    INVALID_USER_ADDRESS_POSTAL_CODE,
    INVALID_USER_ADDRESS_STATE,
    INVALID_USER_PHONE,
    INVALID_EMAIL,
} from 'src/constants/common.constants';

/**
 * DTO used for roles in the UpdateUserDto
 */
export class UpdateUserRoleDto {
    @IsInt()
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
 * DTO used for updating a user
 */
export class UpdateUserDto {
    id: number;

    @ApiProperty()
    @IsOptional()
    firstName: string;

    @ApiProperty()
    @IsOptional()
    lastName: string;

    @ApiProperty()
    @IsOptional()
    userName: string;

    @ApiProperty()
    @IsEmail({}, { message: INVALID_EMAIL })
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsOptional()
    @Matches(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/, {
        message: INVALID_USER_PHONE,
    })
    contactNumber: string;

    @ApiProperty()
    @IsOptional()
    @IsEnum(UserStatusEnum, { message: INVALID_USER_ADDRESS_STATE })
    status: UserStatusEnum;

    @ApiProperty()
    @IsOptional()
    address1: string;

    @ApiProperty()
    address2?: string;

    @ApiProperty()
    @IsOptional()
    city: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(2, {
        message: INVALID_USER_ADDRESS_STATE,
    })
    state: string;

    @ApiProperty()
    @IsOptional()
    @IsPostalCode('US', {
        message: INVALID_USER_ADDRESS_POSTAL_CODE,
    })
    postalCode: string;

    @ValidateNested()
    @ApiProperty({ type: [UpdateUserRoleDto] })
    @IsOptional()
    roles: UpdateUserRoleDto[];
}
