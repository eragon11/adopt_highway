import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();

        Logger.error(`Throttler exception: ${request.method} ${request.url}`);

        response.status(status).json({
            statusCode: status,
            message:
                'Too many requests were made in a short period of time. Please wait before making another request.',
        });
    }
}
