import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class RequestSignApprovalByIdDto {
    @ApiProperty({
        name: 'signRequestDescription',
        type: String,
    })
    @IsOptional()
    signRequestDescription: string;
}
