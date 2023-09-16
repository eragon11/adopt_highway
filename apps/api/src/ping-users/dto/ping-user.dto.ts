import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class PingHrefSchema {
    href: string;
}

export class PingSchema {
    schemas: PingHrefSchema[];
}

export class PingLink {
    schemas?: PingSchema[];
    self: PingHrefSchema;
}

/**
 * Ping AD query response
 */
export class PingEntry {
    mail: string[];
    sn: string[];
    cn: string[];
    userPrincipalName: string;
    objectClass: string[];
    _dn: string[];
    _links: PingLink[];
}

export abstract class BasePingUserByEmail {
    @ApiProperty({
        name: 'mail',
        required: true,
        type: String,
    })
    @IsEmail()
    mail: string;
}

export class GetPingUsersByEmail extends BasePingUserByEmail {}

export class DeletePingUserByEmail extends BasePingUserByEmail {}

export abstract class BasePingUser extends BasePingUserByEmail {
    @ApiProperty({
        name: 'firstName',
        required: true,
        type: String,
        minLength: 3,
    })
    firstName: string;

    @ApiProperty({
        name: 'lastName',
        required: true,
        type: String,
        minLength: 3,
    })
    lastName: string;
}

export class CreatePingUser extends BasePingUser {}

export class UpdatePingUser extends BasePingUser {}
