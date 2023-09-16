import { Column } from 'typeorm';
import { UserContactType as UserContactType } from '../enums';

export abstract class UserJoinedValueTypeEntity {
    @Column('varchar', { length: 100, name: 'VALUE' })
    value: string;

    @Column('varchar', {
        length: 10,
        name: 'TYPE',
    })
    type: string;

    @Column('varchar', {
        length: 500,
        name: 'COMMENT',
    })
    comment: string;

    /**
     *
     */
    constructor(value: string, type: UserContactType, comment: string) {
        this.value = value;
        this.type = type;
        this.comment = comment;
    }
}
