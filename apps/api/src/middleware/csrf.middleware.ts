import {
    BadRequestException,
    Injectable,
    Logger,
    NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { Request, Response } from 'express-serve-static-core';
import csurf from 'csurf';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
    private static options: CsrfOptions;

    public static config(options: CsrfOptions) {
        this.options = options;
    }

    /**
     * Checks for csrf token, when appropriate
     * @param req Request
     * @param res Response
     * @param next callback pipeline
     */
    public use(req: Request, res: Response, next: NextFunction) {
        Logger.log(
            `CSRF middleware ${JSON.stringify(req.method)} ${JSON.stringify(
                req.url,
            )}`,
        );

        // handle errors
        const errorHandler = (err: any) => {
            if (err) {
                if (err.code === 'EBADCSRFTOKEN')
                    throw new BadRequestException('Invalid csrf token');

                throw err;
            }
            return next();
        };

        Logger.debug(`Applying csurf for this query ${req.method} ${req.url}`);
        if (CsrfMiddleware.options) {
            csurf(CsrfMiddleware.options)(req, res, errorHandler);
        } else {
            csurf()(req, res, errorHandler);
        }
    }
}

/**
 * Same as the CookieOptions interface
 */
export interface CsrfOptions {
    value?: (req: Request) => string;
    cookie?: csurf.CookieOptions | boolean;
    ignoreMethods?: string[];
    sessionKey?: string;
}
