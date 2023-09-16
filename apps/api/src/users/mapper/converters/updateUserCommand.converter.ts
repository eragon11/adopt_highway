import { Converter } from '@automapper/core';
import { Address, Email, Phone } from 'src/entities';
import { UserContactType } from 'src/entities/enums';
import { UpdateUserCommand } from 'src/users/commands/impl';

/**
 * Converts an email from {UpdateUserCommand} into an Array with a single item.
 */
export const emailToUpdateUserConverter: Converter<
    UpdateUserCommand,
    Array<Email>
> = {
    convert(source: UpdateUserCommand): Array<Email> {
        const email = new Email();
        email.value = source.email;
        email.type = UserContactType.Primary;
        email.userId = source.id;
        email.comment = 'User updated';

        return new Array<Email>(1).fill(email);
    },
};

export const phoneToUpdateUserConverter: Converter<
    UpdateUserCommand,
    Array<Phone>
> = {
    convert(source: UpdateUserCommand): Array<Phone> {
        const phone = new Phone();
        phone.value = source.contactNumber;
        phone.type = UserContactType.Primary;
        return new Array<Phone>(1).fill(phone);
    },
};

export const addressToUpdateUserConverter: Converter<
    UpdateUserCommand,
    Array<Address>
> = {
    convert(source: UpdateUserCommand): Array<Address> {
        return new Array<Address>(1).fill(
            new Address(
                source.address1,
                source.address2,
                source.city,
                source.state,
                source.postalCode,
                UserContactType.Primary,
                'Y',
                'User updated',
            ),
        );
    },
};
