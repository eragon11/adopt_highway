import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const AahCorsOptions: CorsOptions = {
    origin: process.env.API_ALLOWED_ORIGINS,
    methods: 'GET, POST, DELETE, PUT, OPTIONS, PATCH',
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Accept',
        'Content-Type',
        'X-XSRF-TOKEN',
        'access-control-allow-methods',
        'Access-Control-Allow-Origin',
        'access-control-allow-credentials',
        'access-control-allow-headers',
    ],
    credentials: true,
};
