import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Agreement } from './agreement.entity';
import { PickupType } from 'src/common';

@Entity({ name: 'PICKUP', schema: process.env.DB_SCHEMA })
export class Pickup {
    @PrimaryGeneratedColumn({ name: 'PICKUP_ID' })
    id: number;

    @ManyToOne(() => Agreement, (agreement) => agreement.pickups, {
        eager: true,
        nullable: true,
    })
    @JoinColumn([{ name: 'AGREEMENT_ID' }])
    agreement: Agreement;

    @Column({ name: 'TYPE', enum: PickupType })
    type: PickupType;

    @Column({ name: 'ACTUAL_PICKUP_DATE' })
    actualPickupDate: Date;

    @Column({ name: 'BAG_FILL_QUANTITY' })
    bagFillQuantity: number;

    @Column({ name: 'VOLUME_QUANTITY' })
    volumeQuantity: number;

    @Column({ name: 'VOLUNTEER_COUNT' })
    volunteerCount: number;

    @Column({ name: 'UNUSUAL_ITEM_DESCRIPTION', insert: false })
    unusualItemDescription: string;

    @Column({ name: 'COMMENT' })
    comments: string;

    @Column({
        type: 'datetime2',
        name: 'NEXT_PICKUP_DATE',
        nullable: true,
        select: false,
        insert: false,
    })
    nextPickupDate: Date;

    @Column({
        type: 'int',
        name: 'SCHEDULED_PICKUP_COUNT',
        nullable: true,
        select: false,
        insert: false,
    })
    scheduledPickupCount: number;

    @Column({
        type: 'int',
        name: 'TOTAL_PICKUP_COUNT',
        nullable: true,
        select: false,
        insert: false,
    })
    totalPickupCount: number;
}
