import { Converter } from '@automapper/core';
import { User } from 'src/entities/user.entity';

export const UserFullNameConverter: Converter<User, string> = {
    convert(user: User): string {
        if (!user) {
            return 'None';
        }
        return `${user.lastName.trim()}, ${user.firstName.trim()}`;
    },
};

export const UserEmailConverter: Converter<User, string> = {
    convert(user: User): string {
        if (!user) {
            return 'None';
        }
        return (
            user.primaryEmail?.value ?? user.emails[0]?.value.trim() ?? 'None'
        );
    },
};

export const UserPhoneConverter: Converter<User, string> = {
    convert(user: User): string {
        if (!user) {
            return 'None';
        }
        return (
            user.primaryPhone?.value ?? user.phones[0]?.value.trim() ?? 'None'
        );
    },
};
