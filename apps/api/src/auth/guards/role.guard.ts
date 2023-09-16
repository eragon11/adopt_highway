import {
    CanActivate,
    ExecutionContext,
    Inject,
    Logger,
    mixin,
    Type,
    UnauthorizedException,
} from '@nestjs/common';
import { Role } from 'src/entities/role.entity';
import { AuthService } from '../auth.service';
import RequestWithUser from '../interfaces/requestWithUser.interface';

// returns true if the user.roles possess any of the arg roles
export const RoleGuard = (roles: string[]): Type<CanActivate> => {
    class RoleGuardMixin implements CanActivate {
        constructor(
            @Inject(AuthService) private readonly authService: AuthService,
        ) {}
        async canActivate(context: ExecutionContext) {
            Logger.debug('Running the RoleGuard', 'RoleGuard');
            const request: RequestWithUser = context
                .switchToHttp()
                .getRequest<RequestWithUser>();
            const selectedRole: Role = await this.authService.GetSelectedRole(
                request,
            );
            const includesRole = roles.includes(selectedRole.type);

            if (!includesRole) {
                throw new UnauthorizedException();
            }

            return includesRole;
        }
    }

    return mixin(RoleGuardMixin);
};

export default RoleGuard;
