import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    forwardRef,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Logger,
    Post,
    Req,
    Res,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import RequestWithUser from './interfaces/requestWithUser.interface';
import JwtAuthenticationGuard from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { SetRoleDto } from 'src/dto/setrole.dto';
import { UserDto } from 'src/dto/user.dto';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { RequestUserWithCurrentRole } from 'src/decorators/user-with-current-role.decorator';
import { Config } from 'src/common/enum';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { SamlStrategy } from './strategies/saml.strategy';
import { SamlAuthGuard } from './guards/saml.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
        @Inject(forwardRef(() => SamlStrategy))
        private readonly samlStrategy: SamlStrategy,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        @Inject(forwardRef(() => ConfigService))
        private readonly configService: ConfigService,
        @InjectMapper() readonly mapper: Mapper,
    ) {}

    @Get('login')
    @UseGuards(SamlAuthGuard)
    public login() {
        this.logger.debug('auth/login');
    }

    @HttpCode(HttpStatus.FOUND)
    @Post('login/callback')
    @UseGuards(SamlAuthGuard)
    public async loginCallback(@Req() req: RequestWithUser, @Res() res) {
        try {
            // return if we already redirected in the SamlAuthGuard
            if (res.writableEnded) {
                return;
            }
            this.logger.debug('auth/login/callback');
            const { user } = req;

            const redirectUrl = this.authService.getLoginRedirect(user);

            const accessTokenCookie =
                this.authService.getCookieWithJwtAccessToken(user, 0);
            const { cookie: refreshTokenCookie, token: refreshToken } =
                await this.authService.getCookieWithJwtRefreshToken(user.id, 0);

            await this.userService.setCurrentRefreshToken(
                refreshToken,
                user.id,
            );

            res.setHeader('Set-Cookie', [
                accessTokenCookie,
                refreshTokenCookie,
            ]);

            this.logger.debug(`Redirecting to ${redirectUrl}`);
            res.redirect(redirectUrl);
        } catch (err) {
            this.logger.error(err.message);
            res.redirect(this.configService.get(Config.SERVER_ERROR_PAGE));
        }
    }

    @Get('logout')
    @UseGuards(JwtAuthenticationGuard)
    @HttpCode(HttpStatus.FOUND)
    public async logout(@Req() req: RequestWithUser, @Res() res: Response) {
        try {
            this.logger.log('auth/logout');

            (this.samlStrategy as any).logout(req, (err, request) => {
                if (err) {
                    return;
                }
                this.logger.log('Clearing the cookies');
                res.clearCookie('Authentication', {
                    path: '/',
                    secure: true,
                });
                res.clearCookie('Refresh', { path: '/', secure: true });
                this.logger.log(
                    `Redirecting the user to ${JSON.stringify(request)}`,
                );
                req.logout((error) => {
                    this.logger.error(error);
                });
                res.redirect(request);
            });
        } catch (err) {
            this.logger.error(err.message);
            this.logger.debug(
                `Redirecting to ${this.configService.get(
                    Config.SERVER_ERROR_PAGE,
                )}`,
            );
            res.redirect(this.configService.get(Config.SERVER_ERROR_PAGE));
        }
    }

    @Post('logout/callback')
    public logoutCallback(@Req() req, @Res() res: Response) {
        try {
            this.logger.debug('auth/logout/callback');
            res.redirect(this.configService.get(Config.SAML_LOGOUT_RETURN));
        } catch (err) {
            this.logger.error(err.message);
            res.redirect(this.configService.get(Config.SERVER_ERROR_PAGE));
        }
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get('whoami')
    public async whoami(
        @RequestUserWithCurrentRole() req: RequestWithUser,
    ): Promise<UserDto> {
        this.logger.debug('auth/whoami');
        const userDto = this.mapper.map(req.user, UserDto, User);
        return userDto;
    }

    @Get('failed')
    public failed(@Res() res) {
        try {
            res.status(401).json({ message: 'Not authorized' });
        } catch (err) {
            this.logger.error(err.message);
            res.redirect(this.configService.get(Config.SERVER_ERROR_PAGE));
        }
    }

    @UseGuards(JwtRefreshGuard)
    @HttpCode(200)
    @Get('refresh')
    async refresh(
        @RequestUserWithCurrentRole() req: RequestWithUser,
        @Res() res,
    ): Promise<void> {
        try {
            const { user } = req;
            const accessTokenCookie =
                this.authService.getCookieWithJwtAccessToken(
                    user,
                    user.currentRole?.id || 0,
                );
            const { cookie: refreshTokenCookie, token: refreshToken } =
                await this.authService.getCookieWithJwtRefreshToken(
                    user.id,
                    user.currentRole?.id || 0,
                );

            await this.userService.setCurrentRefreshToken(
                refreshToken,
                user.id,
            );

            res.setHeader('Set-Cookie', [
                accessTokenCookie,
                refreshTokenCookie,
            ]);
            res.send();
        } catch (err) {
            this.logger.error(err.message);
            res.redirect(this.configService.get(Config.SERVER_ERROR_PAGE));
        }
    }

    @Post('setrole')
    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    async setRole(
        @Body() setRoleDto: SetRoleDto,
        @RequestUserWithCurrentRole() req: RequestWithUser,
        @Res() res,
    ): Promise<void> {
        try {
            this.logger.debug('setrole');
            const { user } = req;
            const accessTokenCookie =
                this.authService.getCookieWithJwtAccessToken(
                    user,
                    setRoleDto.roleId,
                );
            const { cookie: refreshTokenCookie, token: refreshToken } =
                await this.authService.getCookieWithJwtRefreshToken(
                    user.id,
                    setRoleDto.roleId,
                );

            await this.userService.setCurrentRefreshToken(
                refreshToken,
                user.id,
            );

            res.setHeader('Set-Cookie', [
                accessTokenCookie,
                refreshTokenCookie,
            ]);
            res.send();
        } catch (err) {
            this.logger.error(err.message);
            res.redirect(this.configService.get(Config.SERVER_ERROR_PAGE));
        }
    }
}
