import { AutoMap } from '@automapper/classes';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';
import { MaintenanceSection } from './maintenancesection.entity';
import { Application } from '../applications/entities/application.entity';

@Entity({ name: 'COUNTY', schema: process.env.DB_SCHEMA })
export class County {
    @AutoMap()
    @PrimaryGeneratedColumn({ name: 'COUNTY_ID' })
    id: number;

    @AutoMap()
    @Column({ name: 'CODE' })
    code: string;

    @AutoMap()
    @Column({ name: 'NAME' })
    name: string;

    @AutoMap()
    @OneToMany(
        () => Application,
        (application) => application.requestedHighwayCountyNumber,
    )
    @Column({ name: 'NUMBER' })
    number: number;

    @ManyToMany(() => District)
    @JoinTable({
        name: 'COUNTY_DISTRICT',
        joinColumn: { name: 'COUNTY_ID' },
        inverseJoinColumn: { name: 'DISTRICT_ID' },
    })
    districts: District[];

    @ManyToMany(() => MaintenanceSection)
    @JoinTable({
        name: 'COUNTY_MAINTENANCE_SECTION',
        joinColumn: { name: 'COUNTY_ID' },
        inverseJoinColumn: { name: 'MAINTENANCE_SECTION_ID' },
    })
    maintenanceSections: MaintenanceSection[];
}
