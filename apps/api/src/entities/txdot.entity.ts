import { AutoMap } from '@automapper/classes';
import { OrganizationDto } from 'src/dto/organization.dto';
import {
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    Entity,
    Column,
} from 'typeorm';
import { Organization } from './organization.entity';

@Entity({ name: 'TXDOT', schema: process.env.DB_SCHEMA })
export class TxDot {
    @PrimaryGeneratedColumn({ name: 'TXDOT_ID' })
    @AutoMap()
    id: number;

    @OneToOne(() => Organization, {
        cascade: ['insert', 'update'],
    })
    @JoinColumn([{ name: 'ORGANIZATION_ID' }])
    @AutoMap({ typeFn: () => OrganizationDto })
    organization: Organization;

    @Column('varchar', { name: 'SECTION_NAME', length: 20 })
    @AutoMap()
    sectionName: string;
}
