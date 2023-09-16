import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    IPaginationOptions,
    Pagination,
    paginate,
} from 'nestjs-typeorm-paginate';
import { Roles } from 'src/common';
import { User } from 'src/entities';
import { Segment } from 'src/entities/segment.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class SegmentsService {
    constructor(
        @InjectRepository(Segment)
        private segmentRepo: Repository<Segment>,
    ) {}

    private getAllSegments: SelectQueryBuilder<Segment> =
        this.segmentRepo.createQueryBuilder('segment');

    async findAll(): Promise<Segment[]> {
        return this.getAllSegments.getMany();
    }

    /**
     * Retrieve the gis.AAH_GIS_SEGMENT table record matching an GLOBAL_ID value
     * @param id GLOBAL_ID value to search for
     * @returns SEGMENT record matching id
     */
    async findOne(id: string): Promise<Segment[]> {
        return this.getAllSegments
            .where('segment.globalId = :globalId', { globalId: id })
            .getMany();
    }

    /**
     * Retrieve the gis.AAH_GIS_SEGMENT table record matching an aahSegmentId value
     * @param aahSegmentId value to search for
     * @returns SEGMENT record matching aahSegmentId
     */
    async findOneByAahSegmentId(aahSegmentId: string): Promise<Segment> {
        return await this.segmentRepo.findOne({ where: { aahSegmentId } });
    }

    /**
     * Retrieve the gis.AAH_GIS_SEGMENT table record matching an AAH_SEGMENT_ID value
     * @param aahSegmentId AAH_SEGMENT_ID value to search for
     * @returns SEGMENT record matching id
     */
    async findAvailableSegmentById(
        aahSegmentId: string,
        currentUser: User,
    ): Promise<Segment> {
        const segment = await this.getAllSegments
            .where(
                `segment.segmentStatus = 'Available' AND segment.aahSegmentId = :aahSegmentId
                AND EXISTS(SELECT r1.USER_ID
                        FROM aah.ORGANIZATION o1
                            INNER JOIN aah.ROLE r1 ON o1.ORGANIZATION_ID = r1.ORGANIZATION_ID
                        WHERE r1.TYPE = :adminRoleType AND r1.USER_ID = :adminUserId AND r1.ROLE_ID = :adminRoleId
                    UNION 
                        SELECT r2.USER_ID
                        FROM aah.ORGANIZATION o2
                            INNER JOIN aah.DISTRICT d2 ON o2.ORGANIZATION_ID = d2.ORGANIZATION_ID
                            INNER JOIN aah.ROLE r2 ON o2.ORGANIZATION_ID = r2.ORGANIZATION_ID
                            INNER JOIN aah.USER_PERSON u1 ON r2.USER_ID = u1.USER_ID
                            INNER JOIN aah.COUNTY_DISTRICT cd1 ON cd1.DISTRICT_ID = d2.DISTRICT_ID
                            INNER JOIN aah.COUNTY c1 ON cd1.COUNTY_ID = c1.COUNTY_ID
                            INNER JOIN gis.AAH_GIS_SEGMENTS ags ON ags.DIST_NBR = d2.NUMBER
                        WHERE 
                            ags.AAH_SEGMENT_ID = segment.AAH_SEGMENT_ID
                            AND r2.TYPE = :dcRoleType
                            AND r2.USER_ID = :dcUserId
                            AND r2.ROLE_ID = :dcRoleId)`,
                {
                    aahSegmentId: aahSegmentId,
                    adminRoleType: Roles.Administrator,
                    adminUserId: currentUser.id,
                    adminRoleId: currentUser.currentRole.id,
                    dcRoleType: Roles.DistrictCoordinator,
                    dcUserId: currentUser.id,
                    dcRoleId: currentUser.currentRole.id,
                },
            )
            .getOne();

        if (!segment) {
            throw new NotFoundException(
                `There is no available segment with ID ${aahSegmentId}`,
            );
        }
        return segment;
    }

    async paginate(options: IPaginationOptions): Promise<Pagination<Segment>> {
        return paginate<Segment>(this.getAllSegments, options);
    }

    /**
     * Save the segment
     * @param {Segment} segment
     * @returns updated Segment
     */
    async save(segment: Segment): Promise<Segment> {
        return this.segmentRepo.save(segment);
    }
}
