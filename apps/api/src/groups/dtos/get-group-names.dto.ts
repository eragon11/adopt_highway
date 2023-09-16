import { ApiProperty } from '@nestjs/swagger';

export class GetGroupNamesDto {
    @ApiProperty({
        name: 'groupName',
        type: String,
        description: 'Partial of the group name with a minimum of 3 characters',
        required: true,
        minLength: 3,
    })
    groupName: string;
}
