import { ApiProperty } from '@nestjs/swagger';

export class RejectSignDto {
    @ApiProperty({
        name: 'signRejectionComments',
        type: String,
        required: true,
    })
    signRejectionComments: string;
}
