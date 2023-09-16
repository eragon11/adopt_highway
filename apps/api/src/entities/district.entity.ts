import { AutoMap } from '@automapper/classes';
import { OrganizationDto } from 'src/dto/organization.dto';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { County, MaintenanceSection } from '.';
import { Organization } from './organization.entity';

@Entity({ name: 'DISTRICT', schema: process.env.DB_SCHEMA })
export class District {
    @AutoMap({ typeFn: () => Number })
    @PrimaryGeneratedColumn({ name: 'DISTRICT_ID' })
    id: number;

    @Column({ name: 'CODE' })
    @AutoMap({ typeFn: () => String })
    code: string;

    @Column({ name: 'NAME' })
    @AutoMap({ typeFn: () => String })
    name: string;

    @Column({ name: 'NUMBER' })
    @AutoMap()
    number: number;

    @OneToOne(() => Organization, (organization) => organization.role, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn([{ name: 'ORGANIZATION_ID' }])
    @AutoMap({ typeFn: () => OrganizationDto })
    organization?: Organization;

    @ManyToMany(() => County, (county) => county.districts)
    @JoinTable({
        name: 'COUNTY_DISTRICT',
        joinColumn: { name: 'DISTRICT_ID', referencedColumnName: 'id' },
        inverseJoinColumn: {
            name: 'COUNTY_ID',
            referencedColumnName: 'id',
        },
    })
    counties: County[];

    @OneToMany(
        () => MaintenanceSection,
        (maintenanceSection) => maintenanceSection.district,
    )
    maintenanceSections: MaintenanceSection[];
}
