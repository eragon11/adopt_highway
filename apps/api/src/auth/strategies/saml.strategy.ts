import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from '@node-saml/passport-saml/lib';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/user.entity';
import { samlPassportConf } from '../config/passport-saml.conf';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
    private readonly logger = new Logger(SamlStrategy.name);

    constructor(private readonly authService: AuthService) {
        super(samlPassportConf);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    async validate(profile: Profile): Promise<User> {
        this.logger.debug(
            `Validating user profile: ${JSON.stringify(profile)}`,
        );
        const aahUser = await this.authService.validateUser(profile);
        return aahUser;
    }
}
