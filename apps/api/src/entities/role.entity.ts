import { AutoMap } from '@automapper/classes';
import { Roles } from 'src/common/enum';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    OneToOne,
} from 'typeorm';
import { Organization } from './organization.entity';
import { User } from './user.entity';

@Entity({ name: 'ROLE', schema: process.env.DB_SCHEMA })
export class Role {
    @PrimaryGeneratedColumn({ name: 'ROLE_ID' })
    @AutoMap()
    id: number;

    @Column({
        name: 'TYPE',
        length: 30,
        type: 'simple-enum',
        enum: Roles,
    })
    @AutoMap()
    type: Roles;

    @ManyToOne(() => User, (user) => user.roles, {
        nullable: false,
        cascade: false,
    })
    @JoinColumn([{ name: 'USER_ID' }])
    user: User;

    @OneToOne(() => Organization, (organization) => organization.role, {
        eager: true,
        cascade: true,
    })
    @AutoMap({ typeFn: () => Organization })
    @JoinColumn([{ name: 'ORGANIZATION_ID' }])
    organization: Organization;
}
