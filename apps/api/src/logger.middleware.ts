import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    public use(req: any, res: any, next: () => void) {
        Logger.debug(`Request ${req.method} ${req.baseUrl}`, 'Logger');
        next();
    }
}
