import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { OrganizationDto } from './organization.dto';

export class RoleDto {
    @IsNotEmpty()
    @AutoMap({ typeFn: () => Number })
    id: number;

    @AutoMap({ typeFn: () => Number })
    @IsNotEmpty()
    type: string;

    @AutoMap({ typeFn: () => OrganizationDto })
    @IsNotEmpty()
    organization: OrganizationDto;
}
