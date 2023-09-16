import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreementDto {
    @ApiProperty()
    agreementId: number;
}
