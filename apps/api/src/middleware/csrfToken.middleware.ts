import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Request } from 'express';
import { Response } from 'express-serve-static-core';

@Injectable()
export class CsrfTokenMiddleware implements NestMiddleware {
    /**
     * Creates a CSRF token
     * @param req Request
     * @param res Response
     * @param next callback pipeline
     */
    public use(req: Request, res: Response, next: NextFunction) {
        const token = (req as Request).csrfToken();
        res.cookie('XSRF-TOKEN', token);
        res.locals.csrfToken = token;
        Logger.log('csrf token = ' + token);
        return next();
    }
}
