import {
    ArgumentMetadata,
    createParamDecorator,
    ExecutionContext,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/interfaces/requestWithUser.interface';

/**
 * Assigns Role for the id of the user's selectedRole to the currentRole
 */
@Injectable()
export class GetUserPipe implements PipeTransform {
    constructor(private authService: AuthService) {}

    async transform(
        requestWithUser: RequestWithUser,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        metadata: ArgumentMetadata,
    ): Promise<RequestWithUser> {
        const role = await this.authService.GetSelectedRole(requestWithUser);
        requestWithUser.user.currentRole = role;
        return requestWithUser;
    }
}

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request;
    },
);

/**
 *
 * @returns {User} with a populated current role from the current execution context
 */
export const RequestUserWithCurrentRole = () => GetUser(GetUserPipe);
