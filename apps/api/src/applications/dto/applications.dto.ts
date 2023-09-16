import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
// import { ApplicationStatus } from 'src/common/enum';

/**
 * DTO for listing all applications
 */
export class ApplicationsDto {
    @AutoMap()
    id: number;

    @AutoMap()
    createdOn: Date;

    @AutoMap({ typeFn: () => Date })
    notModified2Wks: Date;

    @AutoMap({ typeFn: () => Date })
    older30Days: Date;

    @AutoMap()
    groupName: string;

    @AutoMap()
    primaryContactFirstName: string;

    @AutoMap()
    primaryContactLastName: string;

    @AutoMap()
    primaryContactFullName: string;

    @AutoMap()
    primaryContactEmail: string;

    @AutoMap()
    requestedHighwayCountyNumber: number;

    @ApiProperty()
    @AutoMap()
    requestedHighwayCountyName: string;

    @ApiProperty()
    districtNumber: number;

    @ApiProperty()
    districtName: string;

    @AutoMap()
    aahRouteName: string;

    @AutoMap()
    agreementStatus: string;

    @AutoMap()
    signRejectionComments?: string;

    @AutoMap()
    firstScheduledPickup?: Date;

    @AutoMap()
    agreementStartDate?: Date;

    @AutoMap()
    agreementEndDate?: Date;

    @AutoMap()
    requiredPickupsPerYear?: number;

    @AutoMap()
    lengthOfAdoptedSection?: number;

    @AutoMap()
    cleaningCycleOfAdoptedSection?: number;

    @AutoMap()
    txdotContactUserId?: number;

    @AutoMap()
    txdotContactEmail?: string;

    @AutoMap()
    txdotContactFullName?: string;

    @AutoMap()
    txdotContactPhoneNumber?: string;

    @AutoMap()
    pickupsStartDate: Date;

    @AutoMap()
    pickupsEndDate: Date;

    @AutoMap()
    districtId: number;
}
