import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { AgreementWhereType } from 'src/agreements/typeorm';
import { Agreement } from 'src/entities';
import { Repository } from 'typeorm';
import { GetAgreementByApplicationTokenQuery } from '../impl';

@QueryHandler(GetAgreementByApplicationTokenQuery)
export class GetAgreementByApplicationTokenHandler
    implements IQueryHandler<GetAgreementByApplicationTokenQuery>
{
    constructor(
        @InjectRepository(Agreement)
        private repo: Repository<Agreement>,
    ) {}

    /**
     * Creates a where object that filters for active agreements other optional attributes
     * @param options active agreement query object for filtering and pagination
     * @returns a formatted where object
     */
    private getWhereObject(
        options: GetAgreementByApplicationTokenQuery,
    ): AgreementWhereType {
        const where: AgreementWhereType = {
            applicationToken: options.applicationToken,
        };
        return where;
    }

    async execute(
        query: GetAgreementByApplicationTokenQuery,
    ): Promise<Agreement> {
        const agreement = await this.repo.findOne({
            relations: [
                'documents',
                'segment',
                'groupSponsor',
                'groupSponsor.contacts',
                'groupSponsor.contacts.user',
                'pickups',
                'pickupSchedules',
            ],
            where: this.getWhereObject(query),
        });
        return agreement;
    }
}
