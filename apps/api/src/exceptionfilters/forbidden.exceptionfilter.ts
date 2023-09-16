import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    ForbiddenException,
    Logger,
    HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/common/enum';

/**
 * Catches ForbiddenException errors
 */
@Catch(ForbiddenException)
export class ForbiddenExceptionFilter implements ExceptionFilter {
    constructor(private readonly configService: ConfigService) {}

    /**
     * Redirects ForbiddenException to the failed login URL we configured
     * @param {HttpException} exception should be of type ForbiddenException
     * @param host
     */
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        // handles SAML error when an invalid (inactive/soft deleted) user attempts to login
        if (request.url === '/auth/login/callback') {
            Logger.debug(
                'Invalid login redirecting to access denied on the web',
            );
            response
                .status(HttpStatus.FOUND)
                .redirect(
                    this.configService.get(Config.SAML_AAH_LOGIN_FAILURE_URL),
                );
            return;
        } else {
            response.status(status).json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}
