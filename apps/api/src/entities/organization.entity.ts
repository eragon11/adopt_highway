import { AutoMap } from '@automapper/classes';
import { OrganizationType } from 'src/common';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { District } from './district.entity';
import { GroupSponsor } from './groupSponsor.entity';
import { MaintenanceSection } from './maintenancesection.entity';
import { Role } from './role.entity';
import { TxDot } from './txdot.entity';

@Entity({ name: 'ORGANIZATION', schema: process.env.DB_SCHEMA })
export class Organization {
    @PrimaryGeneratedColumn({ name: 'ORGANIZATION_ID' })
    @AutoMap()
    id: number;

    @Column({
        type: 'simple-enum',
        name: 'TYPE',
        enum: OrganizationType.Unknown,
    })
    type: OrganizationType;

    @OneToOne(() => Role, (role) => role.organization, {
        eager: false,
        nullable: true,
        cascade: false,
    })
    @AutoMap({ typeFn: () => Role })
    role?: Role;

    @OneToOne(() => District, (district) => district.organization, {
        eager: true,
        nullable: true,
        cascade: false,
    })
    @AutoMap({ typeFn: () => District })
    district?: District;

    @OneToOne(
        () => MaintenanceSection,
        (maintenanceSection) => maintenanceSection.organization,
        {
            eager: true,
            nullable: true,
            cascade: false,
        },
    )
    @AutoMap({ typeFn: () => MaintenanceSection })
    maintenanceSection?: MaintenanceSection;

    @OneToOne(() => GroupSponsor, (groupSponsor) => groupSponsor.organization, {
        eager: true,
        nullable: true,
        cascade: false,
    })
    @AutoMap({ typeFn: () => GroupSponsor })
    groupSponsor?: GroupSponsor;

    @OneToOne(() => TxDot, (txdot) => txdot.organization, {
        eager: true,
        nullable: true,
        cascade: false,
    })
    @AutoMap({ typeFn: () => TxDot })
    txDot?: TxDot;
}
