import { ApiProperty } from '@nestjs/swagger';

// dto sent to MuleSoft
export class ApplicationTokenDto {
    @ApiProperty({ name: 'applicationToken' })
    applicationToken: string;

    constructor(applicationToken: string) {
        this.applicationToken = applicationToken;
    }
}
