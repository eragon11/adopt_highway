import { AutoMap } from '@automapper/classes';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Agreement } from './agreement.entity';
import { SignStatus } from './signStatus.entity';

@Entity({ name: 'SIGN', schema: process.env.DB_SCHEMA })
export class Sign {
    @PrimaryGeneratedColumn({ name: 'SIGN_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @OneToOne(() => Agreement, (agreement) => agreement.agreementId)
    @AutoMap({ typeFn: () => Agreement })
    @JoinColumn([{ name: 'AGREEMENT_ID' }])
    agreement: Agreement;

    @Column({ name: 'TYPE' })
    @AutoMap({ typeFn: () => String })
    type: string;

    @Column({ name: 'LINE_1' })
    @AutoMap({ typeFn: () => String })
    line1: string;

    @Column({ name: 'LINE_2' })
    @AutoMap({ typeFn: () => String })
    line2: string;

    @Column({ name: 'LINE_3' })
    @AutoMap({ typeFn: () => String })
    line3: string;

    @Column({ name: 'LINE_4' })
    @AutoMap({ typeFn: () => String })
    line4: string;

    @Column({ name: 'COMMENT' })
    @AutoMap({ typeFn: () => String })
    comment: string;

    @OneToMany(() => SignStatus, (signStatus) => signStatus.sign, {
        cascade: true,
    })
    signStatuses?: SignStatus[];

    // used for reports
    latestSignStatus?: SignStatus;
}
