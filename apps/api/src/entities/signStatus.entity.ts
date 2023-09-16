import { AutoMap } from '@automapper/classes';
import { SignStatuses } from 'src/common';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Sign } from './sign.entity';

@Entity({ name: 'SIGN_STATUS', schema: 'aah' }) // verify that this is the correct schema and name - where/how does the entity know to "connect" to this table?
export class SignStatus {
    @PrimaryGeneratedColumn({ name: 'SIGN_STATUS_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @Column({
        type: 'simple-enum',
        name: 'STATUS',
        enum: SignStatuses,
        default: SignStatuses.SignMockupPending,
    })
    @AutoMap()
    status: SignStatuses;

    @Column({ name: 'BEGIN_DATE' })
    @AutoMap({ typeFn: () => Date })
    beginDate: Date;

    @Column({ name: 'COMPLETION_DATE' })
    @AutoMap({ typeFn: () => Date })
    completionDate: Date;

    @Column({ name: 'COMMENT' })
    @AutoMap()
    comment: string;

    @ManyToOne(() => Sign, (sign) => sign.signStatuses, {
        nullable: true,
        cascade: false,
    })
    @JoinColumn([{ name: 'SIGN_ID' }])
    @AutoMap({ typeFn: () => Sign })
    sign: Sign;
}
