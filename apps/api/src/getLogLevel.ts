// from: https://wanago.io/2021/10/04/api-nestjs-logging-typeorm/
import { LogLevel } from '@nestjs/common/services/logger.service';
import { LoggerOptions } from 'typeorm';

export function getLogLevels(isProduction: boolean): LogLevel[] {
    if (isProduction) {
        return ['log', 'warn', 'error'];
    }
    return ['error', 'warn', 'log', 'verbose', 'debug'];
}

export function getTypeOrmLogLevels(isProduction: boolean): LoggerOptions {
    if (isProduction) {
        return ['log', 'warn', 'error'];
    }
    return ['query', 'error', 'warn', 'log', 'info'];
}
