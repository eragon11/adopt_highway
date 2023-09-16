import { SignStatus } from 'src/entities/signStatus.entity';
import { AutoMap } from '@automapper/classes';
import {
    PrimaryGeneratedColumn,
    Entity,
    Column,
    JoinColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import {
    DocusignDocument,
    GroupSponsor,
    Pickup,
    PickupSchedule,
    Segment,
    Sign,
} from '.';
import { AgreementStatusEnum } from 'src/common';

@Entity({ name: 'AGREEMENT', schema: 'aah' }) // verify that this is the correct schema and name - where/how does the entity know to "connect" to this table?
export class Agreement {
    @PrimaryGeneratedColumn({ name: 'AGREEMENT_ID' })
    @AutoMap({ typeFn: () => Number })
    agreementId: number;

    //Agreements columns
    @Column({
        type: 'simple-enum',
        name: 'STATUS',
        enum: AgreementStatusEnum,
        default: AgreementStatusEnum.Pending,
    })
    @AutoMap({ typeFn: () => String })
    status: AgreementStatusEnum;

    @Column({ name: 'BEGIN_DATE' })
    @AutoMap({ typeFn: () => Date })
    beginDate: Date;

    @Column({ name: 'END_DATE' })
    @AutoMap({ typeFn: () => Date })
    endDate: Date;

    @Column({ name: 'COMMENT' })
    @AutoMap({ typeFn: () => String })
    comment: string;

    @ManyToOne(() => GroupSponsor, (groupSponsor) => groupSponsor.agreements, {
        cascade: true,
        eager: false,
        nullable: true,
    })
    @JoinColumn([{ name: 'GROUP_ID' }])
    groupSponsor: GroupSponsor;

    @Column({ name: 'SEGMENT_ID' })
    @AutoMap({ typeFn: () => String })
    segmentId: number;

    @Column({ name: 'AAH_SEGMENT_GLOBAL_ID' })
    @AutoMap({ typeFn: () => String })
    aahSegmentGlobalId: string;

    @AutoMap({ typeFn: () => Segment })
    @OneToOne(() => Segment, (segment) => segment.globalId, { cascade: true })
    @JoinColumn({
        referencedColumnName: 'globalId',
        name: 'AAH_SEGMENT_GLOBAL_ID',
    })
    segment?: Segment;

    @OneToOne(() => Sign, (sign) => sign.agreement, {
        cascade: true,
    })
    sign?: Sign;

    @OneToMany(
        () => PickupSchedule,
        (pickupSchedule) => pickupSchedule.agreement,
        {
            cascade: true,
        },
    )
    pickupSchedules?: PickupSchedule[];

    @OneToMany(() => Pickup, (pickup) => pickup.agreement, { cascade: true })
    pickups?: Pickup[];

    @OneToMany(
        () => DocusignDocument,
        (signedDocument) => signedDocument.agreement,
        {
            eager: true,
            cascade: true,
        },
    )
    documents?: DocusignDocument[];

    @Column({
        name: 'FIRST_CONTRACT_DATE',
        select: false,
        insert: false,
        update: false,
    })
    firstContractDate: Date;

    @Column({ select: false, insert: false, update: false })
    lengthOfTimeInProgram: number;

    @Column({
        name: 'RENEWAL_TIMEFRAME',
        select: false,
        insert: false,
        update: false,
    })
    renewalTimeframe: string;

    @Column({
        name: 'TOTAL_PICKUPS_IN_TIMELINE',
        select: false,
        insert: false,
        update: false,
    })
    totalNumberOfPickupsPerAgreementTimeline: number;

    @Column({
        name: 'TOTAL_SCHEDULED_PICKUPS_IN_TIMELINE',
        select: false,
        insert: false,
        update: false,
    })
    totalNumberOfScheduledPickupsPerAgreementTimeline: number;

    @Column({ name: 'APPLICATION_TOKEN' })
    applicationToken: string;

    latestSignStatus: SignStatus;

    // gets pickups for this agreement time frame
    private _getPickups(): Pickup[] {
        const agreementBeginDate = this.beginDate;
        const agreementEndDate = this.endDate;
        return this.pickups?.filter(
            (c) =>
                c.actualPickupDate >= agreementBeginDate &&
                c.actualPickupDate <= agreementEndDate,
        );
    }

    // returns the pickups sorted by most recent pickup date
    private _getPickupsSortedByMostRecentPickupDateDesc(): Pickup[] {
        const array = this._getPickups();
        return array?.sort((a, b) => {
            return b.actualPickupDate.getDate() - a.actualPickupDate.getDate();
        });
    }

    // converts strings in "YYYY/MMMM" format into first day of the month
    private _convertYearMonthToFirstDayOfMonth(yearMonth: string): Date {
        const nextPickup = yearMonth.trim().split('/');
        return new Date(
            parseInt(nextPickup[1]),
            parseInt(nextPickup[0]) - 1,
            1,
        );
    }

    // converts strings in "YYYY/MMMM" format into last day of the month
    private _convertYearMonthToLastDayOfMonth(yearMonth: string): Date {
        const nextPickup = yearMonth.trim().split('/');
        return new Date(parseInt(nextPickup[0]), parseInt(nextPickup[1]), 0);
    }

    // returns the latest pickup
    getLatestPickup(): Pickup {
        const sorted = this._getPickupsSortedByMostRecentPickupDateDesc();
        return sorted ? sorted[0] : null;
    }

    // returns the next pickup date
    getNextPickupDate(): Date {
        const currentPickupDate =
            this.getLatestPickup()?.actualPickupDate ?? Date.now();

        const array = this.pickupSchedules.map((a) =>
            this._convertYearMonthToFirstDayOfMonth(a.scheduledPickupYearMonth),
        );

        if (!array) {
            return null;
        }

        const futureDates = array.filter((d) => d > currentPickupDate);

        futureDates.sort((a, b) => b.getDate() - a.getDate());

        return futureDates[0];
    }

    // returns the total number of missed pickups
    getNumberOfMissedPickups(): number {
        const pickups = this._getPickups()?.length || 0;
        const scheduled = this.pickupSchedules?.length || 0;
        return scheduled < pickups ? 0 : scheduled - pickups;
    }
}
