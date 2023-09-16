import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SetRoleDto {
    @ApiProperty({
        description: "Role Id from one of the current user's existing roles",
    })
    @IsNotEmpty()
    roleId: number;
}
