import { AutoMap } from '@automapper/classes';
import { DistrictDto, OrganizationDto } from 'src/dto/organization.dto';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { District } from './district.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'MAINTENANCE_SECTION', schema: process.env.DB_SCHEMA })
export class MaintenanceSection {
    @PrimaryGeneratedColumn({ name: 'MAINTENANCE_SECTION_ID' })
    @AutoMap()
    id: number;

    @Column({ name: 'NUMBER' })
    @AutoMap()
    number: number;

    @Column({ name: 'NAME' })
    @AutoMap()
    name: string;

    @OneToOne(() => Organization, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn([{ name: 'ORGANIZATION_ID' }])
    @AutoMap({ typeFn: () => OrganizationDto })
    organization: Organization;

    @ManyToOne(() => District, (district) => district.maintenanceSections, {
        eager: true,
        cascade: ['insert', 'update'],
    })
    @JoinColumn([{ name: 'DISTRICT_ID' }])
    @AutoMap({ typeFn: () => DistrictDto })
    district: District;
}
