import { AutoMap } from '@automapper/classes';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Agreement } from './agreement.entity';

@Entity({ name: 'PICKUP_SCHEDULE', schema: process.env.DB_SCHEMA })
export class PickupSchedule {
    @PrimaryGeneratedColumn({ name: 'PICKUP_SCHEDULE_ID' })
    id: number;

    @ManyToOne(() => Agreement, (agreement) => agreement.pickups, {
        eager: true,
        nullable: true,
    })
    @JoinColumn([{ name: 'AGREEMENT_ID' }])
    agreement: Agreement;

    @Column({ name: 'TYPE' })
    type: string;

    @Column({ name: 'SCHEDULED_PICKUP_YEAR_MONTH' })
    scheduledPickupYearMonth: string;

    @Column({ name: 'SCHEDULED_PICKUP_DATE', type: 'datetime2' })
    @AutoMap({ typeFn: () => Date })
    scheduledPickupDate: Date;

    @Column({ name: 'ESTIMATED_BAG_QUANTITY' })
    estimatedBagQuantity: string;

    @Column({ name: 'ESTIMATED_VEST_QUANTITY' })
    estimatedVestQuantity: string;
}
