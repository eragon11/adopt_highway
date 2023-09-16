import { Converter } from '@automapper/core';
import { SignStatuses } from 'src/common/enum';
import { SignStatus } from 'src/entities/signStatus.entity';

// converter to return true for when status matches is installed enumerator
export const SignInstalledConverter: Converter<SignStatus, string> = {
    convert(source?: SignStatus): string {
        const signInstalled =
            source?.status.toUpperCase() ===
            SignStatuses.SignInstalled.toUpperCase();
        const isInstalled = signInstalled ? 'Yes' : 'No';
        return isInstalled;
    },
};
