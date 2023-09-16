import { ExecutionContext, Injectable, Optional } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard, AuthModuleOptions } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { ALLOW_ANONYMOUS_META_KEY } from 'src/constants/common.constants';

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
    constructor(
        @Optional() protected readonly options: AuthModuleOptions,
        private readonly reflector: Reflector,
    ) {
        super(options);
    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        // Handle anonymous access
        const isAnonymousAllowed =
            this.reflector.get<boolean>(
                ALLOW_ANONYMOUS_META_KEY,
                context.getHandler(),
            ) ||
            this.reflector.get<boolean>(
                ALLOW_ANONYMOUS_META_KEY,
                context.getClass(),
            );
        if (isAnonymousAllowed) {
            return true;
        }

        return super.canActivate(context);
    }
}
