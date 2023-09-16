import { GetActiveAgreementByIdForUserQuery } from './../impl/get-active-agreement-by-id.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Agreement } from 'src/entities';
import { In, Repository } from 'typeorm';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AgreementWhereType, SegmentWhereType } from 'src/agreements/typeorm';
import { AgreementStatusEnum, Roles } from 'src/common';

@QueryHandler(GetActiveAgreementByIdForUserQuery)
export class GetActiveAgreementByIdHandler
    implements IQueryHandler<GetActiveAgreementByIdForUserQuery>
{
    constructor(
        @InjectRepository(Agreement)
        private repo: Repository<Agreement>,
        @InjectMapper() private readonly mapper: Mapper,
    ) {}

    /**
     * Creates a where object that filters for active agreements other optional attributes
     * @param options active agreement query object for filtering and pagination
     * @returns a formatted where object
     */
    private getWhereObject(
        options: GetActiveAgreementByIdForUserQuery,
    ): AgreementWhereType {
        if (options.currentUser === undefined) {
            throw new UnauthorizedException('There was no current user');
        }

        const segment: SegmentWhereType = {};

        const where: AgreementWhereType = {
            agreementId: options.agreementId,
            status: In([
                AgreementStatusEnum.Active,
                AgreementStatusEnum.Pending,
            ]),
        };

        // segmentWhereTypes

        // immediately assign district and office numbers for any roles
        if (
            options.currentUser.currentRole.type === Roles.DistrictCoordinator
        ) {
            segment.districtNumber =
                options.currentUser.currentRole?.organization?.district?.number;
        }

        where.segment = segment;
        return where;
    }

    async execute(
        query: GetActiveAgreementByIdForUserQuery,
    ): Promise<Agreement> {
        const agreement = await this.repo
            .createQueryBuilder('agreement')
            .leftJoinAndSelect('agreement.documents', 'document')
            .leftJoinAndSelect('agreement.segment', 'segment')
            .leftJoinAndSelect('agreement.groupSponsor', 'groupSponsor')
            .leftJoinAndSelect('groupSponsor.contacts', 'groupContact')
            .leftJoinAndSelect('groupContact.user', 'user')
            .leftJoinAndSelect('user.addresses', 'address')
            .leftJoinAndSelect('user.emails', 'email')
            .leftJoinAndSelect('user.phones', 'phone')
            .leftJoinAndSelect('agreement.pickups', 'pickup')
            .leftJoinAndSelect('agreement.pickupSchedules', 'pickupSchedules')
            .leftJoinAndSelect('agreement.sign', 'sign')
            .where(this.getWhereObject(query))
            .getOne();

        // throw if no agreement is found
        if (!agreement) {
            throw new NotFoundException(
                `Could not find active agreement with ID of ${query.agreementId} for this user`,
            );
        }
        return agreement;
    }
}
