import { BadRequestException } from '@nestjs/common';

/**
 * Throw when segment is not available
 */
export class SegmentNotAvailableException extends BadRequestException {
    constructor(aahSegmentId: string) {
        super(
            aahSegmentId,
            `Segment Id: ${aahSegmentId} is not an available segment`,
        );
    }
}
