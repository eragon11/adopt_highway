import { AutoMap } from '@automapper/classes';
import {
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { User } from '.';

@Entity({ name: 'PHONE', schema: process.env.DB_SCHEMA })
export class Phone {
    @PrimaryGeneratedColumn('increment', { name: 'PHONE_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

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

    @ManyToOne(() => User, (user) => user.phones)
    @JoinColumn([{ name: 'USER_ID' }])
    @AutoMap()
    user: User;
}
