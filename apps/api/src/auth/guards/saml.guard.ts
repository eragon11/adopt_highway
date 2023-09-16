import { ConfigService } from '@nestjs/config';
import {
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Config } from 'src/common';

@Injectable()
export class SamlAuthGuard extends AuthGuard('saml') {
    private readonly logger = new Logger(SamlAuthGuard.name);

    constructor(private readonly configService: ConfigService) {
        super();
        this.logger.debug('Creating SamlAuthGuard');
    }

    /**
     * @method canActivate - boolean for whether can access this route or not
     * @param context { ExecutionContext } - execution context to use in logic
     * @returns canActivate {boolean} - true/false can activate route or not
     **/
    canActivate(context: ExecutionContext) {
        /**
            @todo - add your custom authentication logic here
            for example, call super.logIn(request) to establish a session.
        **/
        return super.canActivate(context);
    }

    /**
     * @method handleRequest throw 401 or return the user
     * @param  { Error } err error thrown in the request
     * @param { User } user returned from the service
     * @param { any } info returned from the service
     * @param { ExecutionContext } context execution context
     * @returns {User} User logged
     * @returns {UnauthorizedException} - 401 not authorized exception
     **/
    handleRequest(err, user, info, context: ExecutionContext) {
        try {
            if (err || !user) {
                throw err || new UnauthorizedException();
            }
            return user;
        } catch (err: any) {
            this.logger.error(err.message);
            const response = context.switchToHttp().getResponse();
            const redirectUrl =
                err.status === 401
                    ? this.configService.get(Config.SAML_AAH_LOGIN_FAILURE_URL)
                    : this.configService.get(Config.SERVER_ERROR_PAGE);
            response.redirect(redirectUrl);
        }
    }
}
