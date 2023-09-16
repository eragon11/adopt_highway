import { AutoMap } from '@automapper/classes';
import {
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
    Column,
} from 'typeorm';
import { User } from '.';

@Entity({ name: 'EMAIL', schema: process.env.DB_SCHEMA })
export class Email {
    @PrimaryGeneratedColumn('increment', { name: 'EMAIL_ID' })
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

    @ManyToOne(() => User, (user) => user.emails)
    @JoinColumn([{ name: 'USER_ID' }])
    @AutoMap()
    user: User;

    @Column('int', { name: 'USER_ID' })
    userId: number;
}
