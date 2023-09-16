import { AgreementPickupDto } from 'src/agreements/dto/agreement.pickup.info.dto';
import { User } from 'src/entities';
import { OrderByDirection } from 'src/reports/utils';
import { BaseSortableQuery } from 'src/utils';

/**
 * Used to get pickups by agreement ID
 */
export class GetPickupsByAgreementIdQuery extends BaseSortableQuery<AgreementPickupDto> {
    orderBy: keyof AgreementPickupDto;
    orderByDirection: OrderByDirection;

    agreementId: number;
    currentUser: User;

    constructor(
        agreementId: number,
        currentUser: User,
        page: number,
        orderBy: keyof AgreementPickupDto,
        orderByDirection: OrderByDirection,
    ) {
        super();
        this.agreementId = agreementId;
        this.currentUser = currentUser;
        this.page = page;
        this.orderBy = orderBy;
        this.orderByDirection = orderByDirection;
    }
}
