import { RenewalAgreementDto } from 'src/agreements/dto';
import { RenewalStatus } from 'src/common';
import { User } from 'src/entities';
import { OrderByDirection } from 'src/reports/utils';
import { BaseFilterAndSortableQuery, FilterProperties } from 'src/utils';

export class GetRenewalAgreementsQuery
    extends BaseFilterAndSortableQuery<RenewalAgreementDto>
    implements FilterProperties
{
    renewalStatus: RenewalStatus;
    orderBy: keyof RenewalAgreementDto;
    orderByDirection: OrderByDirection;
    currentUser: User;

    constructor(
        districtNumber: number,
        officeNumber: number,
        countyNumber: number,
        groupName: string,
        renewalStatus: RenewalStatus,
        currentUser: User,
        page: number,
        orderBy: keyof RenewalAgreementDto,
        orderByDirection: OrderByDirection,
    ) {
        super(districtNumber, officeNumber, countyNumber, groupName);
        this.currentUser = currentUser;
        this.page = page;
        this.orderBy = orderBy;
        this.orderByDirection = orderByDirection;
        this.renewalStatus = renewalStatus;
    }
}
