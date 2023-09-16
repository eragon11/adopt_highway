import { AutoMap } from '@automapper/classes';
import { Exclude } from 'class-transformer';
import { UserStatusEnum } from 'src/common/enum';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    JoinColumn,
    DeleteDateColumn,
} from 'typeorm';
import { Role, Address, Email, Phone, GroupContact } from '.';

@Entity({ name: 'USER_PERSON', schema: process.env.DB_SCHEMA })
export class User {
    @PrimaryGeneratedColumn('increment', { name: 'USER_ID' })
    @AutoMap()
    id: number;

    @Column('varchar', { name: 'USERNAME', length: 100 })
    @AutoMap()
    userName: string;

    @Column('varchar', { name: 'FIRST_NAME', length: 30 })
    @AutoMap()
    firstName: string;

    @Column('varchar', { name: 'LAST_NAME', length: 30 })
    @AutoMap()
    lastName: string;

    @Column('varchar', { name: 'FULL_NAME', length: 120 })
    @AutoMap()
    fullName: string;

    @Column('varchar', { name: 'STATUS', length: 100 })
    @AutoMap({ typeFn: () => String })
    status: UserStatusEnum;

    @Column('datetime2', { name: 'LAST_LOGIN_DTTM' })
    lastLogin: Date;

    @OneToMany(() => Role, (role) => role.user, {
        eager: true,
        nullable: false,
        primary: true,
        cascade: true,
    })
    roles?: Role[];

    @Exclude()
    @Column({ name: 'CURRENT_HASHED_REFRESH_TOKEN' })
    public currentHashedRefreshToken?: string;

    @OneToMany(() => Address, (address) => address.user, {
        eager: true,
        nullable: false,
        primary: true,
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinColumn({ name: 'USER_ID' })
    addresses?: Address[];

    @OneToMany(() => Email, (email) => email.user, {
        eager: true,
        nullable: false,
        primary: true,
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinColumn({ name: 'USER_ID' })
    emails?: Email[];

    @OneToMany(() => Phone, (phone) => phone.user, {
        eager: true,
        nullable: false,
        primary: true,
        cascade: ['insert', 'update', 'remove'],
    })
    @JoinColumn({ name: 'USER_ID' })
    phones?: Phone[];

    @DeleteDateColumn({ name: 'DELETED_AT' })
    public deletedAt: Date;

    // Role when selected
    currentRole?: Role;

    primaryPhone?: Phone | null;

    primaryMailingAddress?: Address | null;

    primaryPhysicalAddress?: Address | null;

    primaryEmail?: Email | null;

    @OneToMany(() => GroupContact, (groupContact) => groupContact.user, {
        cascade: false,
    })
    groupContacts?: GroupContact[] | null;

    /**
     *
     */
    constructor(
        userName: string,
        firstName: string,
        lastName: string,
        status: UserStatusEnum,
    ) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
        this.fullName = `${firstName} ${lastName}`.trim();
    }
}
