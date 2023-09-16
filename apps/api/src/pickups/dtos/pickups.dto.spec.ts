import moment from 'moment';
import { InsertPickupByIdDto } from './insert-pickup-by-id.dto';
import { Validator } from 'class-validator';
import { INVALID_ACTUAL_PICKUP_DATE } from 'src/constants/common.constants';
import { PickupType } from 'src/common';

describe('InsertPickupByIdDto specs', () => {
    it('should not allow future dates', async () => {
        const dto = new InsertPickupByIdDto();
        dto.pickupDate = moment().add(1, 'week').toDate();
        dto.comments = 'test';
        dto.numberOfBagsCollected = 10;
        dto.numberOfVolunteers = 10;
        dto.type = PickupType.FallSweeps;

        const validator = new Validator();
        const errors = await validator.validate(dto);
        expect(errors.length).toBe(1);
        expect(errors[0].constraints).toMatchObject({
            maxDate: INVALID_ACTUAL_PICKUP_DATE,
        });
    });

    it('should allow past dates', async () => {
        const dto = new InsertPickupByIdDto();
        dto.type = PickupType.Regular;
        dto.pickupDate = new Date('2021-04-20T21:54:30.772Z');
        dto.numberOfBagsCollected = 10;
        dto.numberOfVolunteers = 10;
        dto.comments = 'test';

        const validator = new Validator();
        const errors = await validator.validate(dto);
        expect(errors.length).toBe(0);
    });
});
