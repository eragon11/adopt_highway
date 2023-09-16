import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';
import { GuidRegEx } from 'src/utils';

export class GetApplicationByTokensQuery {
    @ApiProperty()
    @IsNotEmpty()
    @Matches(GuidRegEx, { message: 'Request is not valid' })
    applicationToken: string;

    @ApiProperty()
    @IsNotEmpty()
    @Matches(GuidRegEx, { message: 'Request is not valid' })
    accessToken: string;

    constructor(applicationToken: string, accessToken: string) {
        this.applicationToken = applicationToken;
        this.accessToken = accessToken;
    }
}
