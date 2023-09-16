import { AutoMap } from '@automapper/classes';
import { RoleDto } from 'src/dto/role.dto';

export class AddressDto {
    @AutoMap()
    addressLine1: string;

    @AutoMap()
    addressLine2: string;

    @AutoMap()
    city: string;

    @AutoMap()
    state: string;

    @AutoMap()
    postalCode: string;

    @AutoMap()
    type: string;
}

export class PhoneDto {
    @AutoMap()
    value: string;
}

export class EmailAddressDto {
    @AutoMap()
    value: string;
}

/**
 * DTO for the User Management views
 */
export class UserProfileDto {
    @AutoMap()
    id: number;

    @AutoMap()
    userName: string;

    @AutoMap()
    firstName: string;

    @AutoMap()
    fullName: string;

    @AutoMap()
    lastName: string;

    @AutoMap({ typeFn: () => RoleDto })
    roles?: RoleDto[] | null;

    @AutoMap()
    status: string;

    @AutoMap({ typeFn: () => AddressDto })
    addresses: AddressDto[] | null;

    @AutoMap({ typeFn: () => EmailAddressDto })
    emails?: EmailAddressDto[] | null;

    @AutoMap({ typeFn: () => PhoneDto })
    phones?: PhoneDto[] | null;

    @AutoMap({ typeFn: () => PhoneDto })
    currentRole?: RoleDto;

    @AutoMap()
    lastLogin?: Date;
}
