import { AutoMap } from '@automapper/classes';
import {
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { UserContactType } from './enums';
import { User } from './user.entity';

@Entity({ name: 'ADDRESS', schema: process.env.DB_SCHEMA })
export class Address {
    @PrimaryGeneratedColumn('increment', { name: 'ADDRESS_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @Column('char', {
        length: 3,
        name: 'PRIMARY_CONTACT',
    })
    primaryContact: string;

    @Column('varchar', {
        length: 50,
        name: 'ADDRESS_LINE1',
    })
    addressLine1: string;

    @Column('varchar', {
        length: 50,
        name: 'ADDRESS_LINE2',
    })
    addressLine2: string;

    @Column('varchar', {
        length: 50,
        name: 'CITY',
    })
    city: string;

    @Column('varchar', {
        length: 2,
        name: 'STATE',
    })
    state: string;

    @Column('varchar', {
        length: 10,
        name: 'POSTAL_CODE',
    })
    postalCode: string;

    @Column('varchar', {
        name: 'TYPE',
    })
    type: string;

    @Column('varchar', {
        name: 'COMMENT',
    })
    comment: string;

    @ManyToOne(() => User, (user) => user.addresses)
    @JoinColumn([{ name: 'USER_ID' }])
    @AutoMap()
    user: User;

    @Column({ name: 'USER_ID' })
    userId: number;

    /**
     *
     */
    constructor(
        address1: string,
        address2: string,
        city: string,
        state: string,
        postalCode: string,
        type: UserContactType,
        primaryContact: string,
        comment: string,
    ) {
        this.addressLine1 = address1;
        this.addressLine2 = address2;
        this.city = city;
        this.state = state;
        this.postalCode = postalCode;
        this.type = type;
        this.primaryContact = primaryContact;
        this.comment = comment;
    }
}
