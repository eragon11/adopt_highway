import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { GuidRegEx } from 'src/utils';

/**
 * DTO for confirming new applications
 */
export class TokenizedApplicationDto {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(GuidRegEx, { message: 'Request is not valid' })
    applicationToken: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(GuidRegEx, { message: 'Request is not valid' })
    accessToken: string;
}
