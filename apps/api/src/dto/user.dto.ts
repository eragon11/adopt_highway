import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { RoleDto } from './role.dto';

export class UserDto {
    @AutoMap({ typeFn: () => Number })
    id: number;

    @IsNotEmpty()
    @AutoMap({ typeFn: () => String })
    userName: string;

    @IsNotEmpty()
    @AutoMap({ typeFn: () => String })
    firstName: string;

    @IsNotEmpty()
    @AutoMap({ typeFn: () => String })
    lastName: string;

    @AutoMap({ typeFn: () => Number })
    selectedRole?: number;

    @AutoMap({ typeFn: () => RoleDto })
    roles?: RoleDto[];

    @AutoMap({ typeFn: () => RoleDto })
    currentRole: RoleDto;
}
