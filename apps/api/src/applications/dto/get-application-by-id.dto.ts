import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetApplicationByIdDto {
    @ApiProperty({
        name: 'applicationId',
        type: Number,
        minimum: 1,
        required: true,
    })
    @IsNumber()
    applicationId: number;
}
