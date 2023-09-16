import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsOptional,
    IsInt,
    IsEmail,
    IsPostalCode,
    Matches,
    MaxLength,
    ValidateNested,
    IsDefined,
} from 'class-validator';
import { Roles, UserStatusEnum } from 'src/common/enum';
import {
    INVALID_EMAIL,
    INVALID_ROLE_TYPE,
    INVALID_USERNAME,
    INVALID_USER_ADDRESS_POSTAL_CODE,
    INVALID_USER_ADDRESS_STATE,
    INVALID_USER_PHONE,
    INVALID_USER_ROLES_REQUIRED,
    INVALID_USER_STATUS,
} from 'src/constants/common.constants';

/**
 * DTO used for roles in the CreateUserDto
 */
export class CreateUserRoleDto {
    @ApiProperty()
    @IsEnum(Roles, { always: true, message: INVALID_ROLE_TYPE })
    roleType: Roles;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    districtNumber?: number | null;

    @ApiProperty()
    @IsOptional()
    @IsInt()
    officeNumber?: number | null;

    constructor(roleType: Roles, districtNumber: number, officeNumber: number) {
        this.roleType = roleType;
        this.districtNumber = districtNumber;
        this.officeNumber = officeNumber;
    }
}

/**
 * DTO for creating users with Swagger decorators
 */
export class CreateUserDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    @IsDefined({ message: INVALID_USERNAME })
    userName: string;

    @ApiProperty()
    @IsEmail({}, { message: INVALID_EMAIL })
    email: string;

    @ApiProperty()
    @Matches(/^(\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$/, {
        message: INVALID_USER_PHONE,
    })
    contactNumber: string;

    @ApiProperty()
    @IsEnum(UserStatusEnum, { message: INVALID_USER_STATUS })
    status?: UserStatusEnum;

    @ApiProperty()
    @IsOptional()
    address1?: string;

    @ApiProperty()
    @IsOptional()
    address2?: string;

    @ApiProperty()
    @IsOptional()
    city?: string;

    @ApiProperty()
    @IsOptional()
    @MaxLength(2, {
        message: INVALID_USER_ADDRESS_STATE,
    })
    state?: string;

    @ApiProperty()
    @IsOptional()
    @IsPostalCode('US', {
        message: INVALID_USER_ADDRESS_POSTAL_CODE,
    })
    postalCode?: string;

    @ValidateNested()
    @IsDefined({ message: INVALID_USER_ROLES_REQUIRED })
    @Type(() => CreateUserRoleDto)
    @ApiProperty({ type: [CreateUserRoleDto] })
    roles: CreateUserRoleDto[];
}
