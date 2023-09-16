import { SetMetadata } from '@nestjs/common';
import { ALLOW_ANONYMOUS_META_KEY } from 'src/constants/common.constants';

export const AllowAnonymous = () => SetMetadata(ALLOW_ANONYMOUS_META_KEY, true);
