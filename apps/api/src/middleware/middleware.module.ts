import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CsrfMiddleware } from './csrf.middleware';
import { CsrfTokenMiddleware } from './csrfToken.middleware';

@Module({})
export class MiddlewareModule {
    configure(consumer: MiddlewareConsumer) {
        CsrfMiddleware.config({
            cookie: true,
        });

        consumer
            .apply(CsrfMiddleware)
            .exclude(
                {
                    path: '/auth/login/callback',
                    method: RequestMethod.ALL,
                },
                {
                    path: '/auth/logout/callback',
                    method: RequestMethod.ALL,
                },
                {
                    path: '/applications',
                    method: RequestMethod.ALL,
                },
            )
            .forRoutes({ path: '*', method: RequestMethod.ALL });

        consumer.apply(CsrfTokenMiddleware).forRoutes(
            {
                path: '/auth/whoami',
                method: RequestMethod.GET,
            },
            {
                path: '/',
                method: RequestMethod.POST,
            },
        );
    }
}
