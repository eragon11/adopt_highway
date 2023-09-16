import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UserService } from '../../users/users.service';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import TokenPayload from '../interfaces/tokenPayload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        @InjectMapper() readonly mapper: Mapper,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.Refresh;
                },
            ]),
            secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload): Promise<UserDto> {
        try {
            const refreshToken = request.cookies?.Refresh;
            const user = await this.userService.getUserIfRefreshTokenMatches(
                refreshToken,
                payload.sub,
            );
            const userDto = this.mapper.map(user, UserDto, User);
            return userDto;
        } catch (err) {
            Logger.error(err.message, 'JwtRefreshTokenStrategy::validate');
            throw err;
        }
    }
}
