import { AutoMap } from '@automapper/classes';
import { GroupTypes } from 'src/common';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Agreement } from './agreement.entity';
import { County } from './county.entity';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity({ name: 'GROUP_SPONSOR', schema: process.env.DB_SCHEMA })
export class GroupSponsor {
    @PrimaryGeneratedColumn({ name: 'GROUP_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @Column({ name: 'TYPE' })
    @AutoMap({ typeFn: () => String })
    type: GroupTypes;

    @Column({ name: 'NAME' })
    @AutoMap({ typeFn: () => String })
    name: string;

    @Column({ name: 'ESTIMATED_VOLUNTEER_COUNT' })
    @AutoMap({ typeFn: () => Number })
    estimatedVolunteerCount: number;

    @Column({ name: 'APPLICATION_SEND_DATE' })
    @AutoMap({ typeFn: () => Date })
    applicationSendDate: Date;

    @Column({ name: 'INITIAL_CONTACT_DATE' })
    @AutoMap({ typeFn: () => Date })
    initialContactDate: Date;

    @Column({ name: 'COMMENT' })
    @AutoMap({ typeFn: () => String })
    comment: string;

    @OneToOne(() => Organization, (organization) => organization.groupSponsor, {
        cascade: true,
    })
    @AutoMap({ typeFn: () => Organization })
    @JoinColumn([{ name: 'ORGANIZATION_ID' }])
    organization: Organization;

    @OneToOne(() => County, { cascade: false })
    @AutoMap({ typeFn: () => County })
    @JoinColumn([{ name: 'COUNTY_ID' }])
    county: County;

    @OneToMany(() => Agreement, (agreement) => agreement.agreementId, {
        cascade: false,
    })
    @JoinColumn([{ name: 'AGREEMENT_ID' }])
    agreements: Agreement[];

    countOfType: number;

    percentageOfTotal: number;

    currentActiveAgreement?: Agreement;

    @OneToMany(
        () => GroupContact,
        (groupContact) => groupContact.groupSponsor,
        {
            cascade: true,
        },
    )
    contacts: GroupContact[];

    primaryContact?: User | null;

    secondaryContact?: User | null;
}

@Entity({ name: 'GROUP_CONTACTS', schema: process.env.DB_SCHEMA })
export class GroupContact {
    @PrimaryGeneratedColumn({ name: 'GROUP_CONTACT_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @ManyToOne(() => GroupSponsor, (group) => group.contacts, {
        cascade: false,
    })
    @JoinColumn([{ name: 'GROUP_ID' }])
    groupSponsor: GroupSponsor;

    @ManyToOne(() => User, (user) => user.groupContacts, {
        cascade: true,
    })
    @JoinColumn([{ name: 'USER_ID' }])
    user: User;

    @Column('bit', { name: 'IS_PRIMARY_CONTACT' })
    @AutoMap({ typeFn: () => Boolean })
    isPrimary: boolean;
}
