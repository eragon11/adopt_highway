import {
    convertUsing,
    ignore,
    mapFrom,
    Mapper,
    MappingProfile,
    mapWith,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import {
    DistrictDto,
    GroupSponsorDto,
    MaintenanceSectionDto,
    OrganizationDto,
    TxDotDto,
} from 'src/dto/organization.dto';
import { RoleDto } from 'src/dto/role.dto';
import { UserDto } from 'src/dto/user.dto';
import {
    Address,
    District,
    Email,
    GroupSponsor,
    MaintenanceSection,
    Organization,
    Phone,
    Role,
    User,
} from 'src/entities';
import { TxDot } from 'src/entities/txdot.entity';
import { CreateUserCommand, UpdateUserCommand } from '../commands/impl';
import {
    CreateUserRoleDto,
    GetUserProfileDto,
    GetUserProfileRoleDto,
    UpdateUserRoleDto,
} from '../dtos';
import {
    AddressDto,
    EmailAddressDto,
    PhoneDto,
    UserProfileDto,
} from '../dtos/user-profile.dto';
import {
    addressToUpdateUserConverter,
    emailToUpdateUserConverter,
    phoneToUpdateUserConverter,
} from './converters/updateUserCommand.converter';

@Injectable()
export class UserMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(TxDot, TxDotDto)
                .forMember(
                    (destination) => destination.id,
                    mapFrom((source: TxDot) => source.id),
                )
                .forMember(
                    (destination) => destination.sectionName,
                    mapFrom((source: TxDot) => source.sectionName),
                );

            mapper.createMap(GroupSponsor, GroupSponsorDto);
            mapper.createMap(District, DistrictDto);
            mapper
                .createMap(MaintenanceSection, MaintenanceSectionDto)
                .forMember(
                    (destination: MaintenanceSectionDto) =>
                        destination.districtAbbreviation,
                    mapFrom(
                        (source: MaintenanceSection) => source?.district?.code,
                    ),
                )
                .forMember(
                    (destination: MaintenanceSectionDto) =>
                        destination.districtNumber,
                    mapFrom(
                        (source: MaintenanceSection) =>
                            source?.district?.number,
                    ),
                )
                .forMember(
                    (destination: MaintenanceSectionDto) =>
                        destination.districtName,
                    mapFrom(
                        (source: MaintenanceSection) => source?.district?.name,
                    ),
                );
            mapper.createMap(Organization, OrganizationDto).forMember(
                (destination) => destination.txDot,
                mapFrom((source) => source.txDot),
            );
            mapper.createMap(Role, RoleDto);

            mapper
                .createMap(Address, AddressDto)
                .forMember(
                    (destination) => destination.type,
                    mapFrom((source) => source.type),
                )
                .forMember(
                    (destination) => destination.addressLine1,
                    mapFrom((source) => source.addressLine1),
                )
                .forMember(
                    (destination) => destination.addressLine2,
                    mapFrom((source) => source.addressLine2),
                )
                .forMember(
                    (destination) => destination.city,
                    mapFrom((source) => source.city),
                )
                .forMember(
                    (destination) => destination.state,
                    mapFrom((source) => source.state),
                )
                .forMember(
                    (destination) => destination.postalCode,
                    mapFrom((source) => source.postalCode),
                );
            mapper.createMap(Email, EmailAddressDto).forMember(
                (destination) => destination.value,
                mapFrom((source) => source.value),
            );
            mapper.createMap(Phone, PhoneDto).forMember(
                (destination) => destination.value,
                mapFrom((source) => source.value),
            );

            mapper
                .createMap(User, UserDto)
                .forMember(
                    (destination: UserDto) => destination.userName,
                    mapFrom((source) => source.userName),
                )
                .forMember(
                    (destination: UserDto) => destination.firstName,
                    mapFrom((source) => source.firstName),
                )
                .forMember(
                    (destination: UserDto) => destination.lastName,
                    mapFrom((source) => source.lastName),
                )
                .forMember(
                    (destination: UserDto) => destination.selectedRole,
                    mapFrom((source) => source?.currentRole?.id ?? null),
                )
                .forMember(
                    (destination: UserDto) => destination.currentRole,
                    mapWith(
                        RoleDto,
                        Role,
                        (source: User) => source.currentRole,
                    ),
                )
                .forMember(
                    (d) => d.roles,
                    mapWith(RoleDto, Role, (s) => s.roles),
                );

            mapper
                .createMap(User, UserProfileDto)
                .forMember(
                    (destination) => destination.userName,
                    mapFrom((source) => source.userName),
                )
                .forMember(
                    (destination) => destination.firstName,
                    mapFrom((source) => source.firstName),
                )
                .forMember(
                    (destination) => destination.lastName,
                    mapFrom((source) => source.lastName),
                )
                .forMember(
                    (destination) => destination.fullName,
                    mapFrom(
                        (source) => `${source.firstName} ${source.lastName}`,
                    ),
                )
                .forMember(
                    (destination) => destination.addresses,
                    mapFrom((source) => source.addresses),
                )
                .forMember(
                    (destination) => destination.phones,
                    mapFrom((source) => source.phones),
                )
                .forMember(
                    (destination) => destination.emails,
                    mapFrom((source) => source.emails),
                )
                .forMember(
                    (destination) => destination.currentRole,
                    mapWith(RoleDto, Role, (s) => s.currentRole),
                )
                .forMember(
                    (d) => d.roles,
                    mapWith(RoleDto, Role, (s) => s.roles),
                )
                .forMember(
                    (destination) => destination.lastLogin,
                    mapFrom((source) => source.lastLogin),
                );

            mapper
                .createMap(UpdateUserCommand, User)
                .forMember(
                    (destination: User) => destination.id,
                    mapFrom((source: UpdateUserCommand) => source.id),
                )
                .forMember(
                    (destination: User) => destination.userName,
                    mapFrom((source: UpdateUserCommand) => source.userName),
                )
                .forMember(
                    (destination: User) => destination.lastName,
                    mapFrom((source: UpdateUserCommand) => source.lastName),
                )
                .forMember(
                    (destination: User) => destination.firstName,
                    mapFrom((source: UpdateUserCommand) => source.firstName),
                )
                .forMember(
                    (destination: User) => destination.fullName,
                    mapFrom(
                        (source) => `${source.firstName} ${source.lastName}`,
                    ),
                )
                .forMember(
                    (destination: User) => destination.emails,
                    convertUsing(
                        emailToUpdateUserConverter,
                        (source: UpdateUserCommand) => source,
                    ),
                )
                .forMember(
                    (destination: User) => destination.phones,
                    convertUsing(
                        phoneToUpdateUserConverter,
                        (source: UpdateUserCommand) => source,
                    ),
                )
                .forMember(
                    (destination: User) => destination.addresses,
                    convertUsing(
                        addressToUpdateUserConverter,
                        (source: UpdateUserCommand) => source,
                    ),
                );

            this.mapper
                .createMap(CreateUserRoleDto, UpdateUserRoleDto)
                .forMember(
                    (destination: UpdateUserRoleDto) => destination.roleType,
                    mapFrom((source: CreateUserRoleDto) => source.roleType),
                )
                .forMember(
                    (destination: UpdateUserRoleDto) =>
                        destination.districtNumber,
                    mapFrom(
                        (source: CreateUserRoleDto) => source.districtNumber,
                    ),
                )
                .forMember(
                    (destination: UpdateUserRoleDto) =>
                        destination.officeNumber,
                    mapFrom((source: CreateUserRoleDto) => source.officeNumber),
                );

            this.mapper
                .createMap(CreateUserCommand, UpdateUserCommand)
                .forMember(
                    (destination: UpdateUserCommand) => destination.id,
                    mapFrom((source: CreateUserCommand) => source.id),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.firstName,
                    mapFrom((source: CreateUserCommand) => source.firstName),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.lastName,
                    mapFrom((source: CreateUserCommand) => source.lastName),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.userName,
                    mapFrom((source: CreateUserCommand) => source.userName),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.address1,
                    mapFrom((source: CreateUserCommand) => source.address1),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.address2,
                    mapFrom((source: CreateUserCommand) => source.address2),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.city,
                    mapFrom((source: CreateUserCommand) => source.city),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.email,
                    mapFrom((source: CreateUserCommand) => source.email),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.postalCode,
                    mapFrom((source: CreateUserCommand) => source.postalCode),
                )
                .forMember(
                    (d) => d.roles,
                    mapWith(
                        UpdateUserRoleDto,
                        CreateUserRoleDto,
                        (s) => s.roles,
                    ),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.status,
                    mapFrom((source: CreateUserCommand) => source.status),
                )
                .forMember(
                    (destination: UpdateUserCommand) => destination.currentUser,
                    mapFrom((source: CreateUserCommand) => source.currentUser),
                );

            this.mapper
                .createMap(Role, GetUserProfileRoleDto)
                .forMember(
                    (destination: GetUserProfileRoleDto) => destination.id,
                    mapFrom((source: Role) => source.id),
                )
                .forMember(
                    (destination: GetUserProfileRoleDto) =>
                        destination.roleType,
                    mapFrom((source: Role) => source.type),
                )
                .forMember(
                    (destination: GetUserProfileRoleDto) =>
                        destination.districtNumber,
                    mapFrom((source: Role) => {
                        if (source.type === 'Maintenance Coordinator') {
                            return source.organization?.maintenanceSection
                                .district.number;
                        }
                        if (source.type === 'District Coordinator') {
                            return source.organization.district.number;
                        }
                    }),
                )
                .forMember(
                    (destination: GetUserProfileRoleDto) =>
                        destination.officeNumber,
                    mapFrom((source: Role) => {
                        if (source.type === 'Maintenance Coordinator') {
                            return source.organization?.maintenanceSection
                                .number;
                        }
                    }),
                );

            this.mapper
                .createMap(User, GetUserProfileDto)
                .forMember(
                    (destination: GetUserProfileDto) => destination.id,
                    mapFrom((source: User) => source.id),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.userName,
                    mapFrom((source: User) => source.userName),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.lastName,
                    mapFrom((source: User) => source.lastName),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.firstName,
                    mapFrom((source: User) => source.firstName),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.email,
                    mapFrom((source: User) => source.emails[0]?.value ?? ''),
                )
                .forMember(
                    (destination: GetUserProfileDto) =>
                        destination.contactNumber,
                    mapFrom((source: User) => source.phones[0]?.value ?? ''),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.address1,
                    mapFrom(
                        (source: User) =>
                            source.addresses[0]?.addressLine1 ?? '',
                    ),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.address2,
                    mapFrom(
                        (source: User) =>
                            source.addresses[0]?.addressLine2 ?? '',
                    ),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.city,
                    mapFrom((source: User) => source.addresses[0]?.city ?? ''),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.state,
                    mapFrom((source: User) => source.addresses[0]?.state ?? ''),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.postalCode,
                    mapFrom(
                        (source: User) => source.addresses[0]?.postalCode ?? '',
                    ),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.roles,
                    mapWith(
                        GetUserProfileRoleDto,
                        Role,
                        (source: User) => source.roles,
                    ),
                )
                .forMember(
                    (destination: GetUserProfileDto) => destination.currentUser,
                    ignore(),
                );
        };
    }
}
