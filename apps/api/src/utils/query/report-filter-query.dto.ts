import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

/**
 * URI query params used by reports to filter for district and office
 */
export class ReportFilterQueryDto {
    @ApiProperty({
        name: 'districtNumber',
        type: Number,
        minimum: 1,
        maximum: 25,
        required: false,
    })
    @Transform((params) => {
        return params.value && parseInt(params.value, 10);
    })
    districtNumber: number;

    @ApiProperty({
        name: 'officeNumber',
        type: Number,
        minimum: 1,
        maximum: 50,
        required: false,
    })
    @Transform((params) => {
        return params.value && parseInt(params.value, 10);
    })
    officeNumber: number;
}
