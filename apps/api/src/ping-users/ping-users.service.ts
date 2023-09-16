import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import oauth from 'axios-oauth-client';
import { Config } from 'src/common/enum';
import { PingEntry } from './dto';
import { generate, GenerateOptions } from 'generate-password';
import { MailTemplate, SendMailCommand } from 'src/mail/command/impl';
import { CommandBus } from '@nestjs/cqrs';

/**
 * Service methods for making requests for Ping Authentication
 */
@Injectable()
export class PingUsersService {
    host = this.configService.get(Config.PING_AD_HOST);
    userName = this.configService.get(Config.PING_AD_CLIENT_ID);
    password = this.configService.get(Config.PING_AD_CLIENT_SECRET);

    /**
     *
     */
    constructor(
        private readonly configService: ConfigService,
        private readonly commandBus: CommandBus,
    ) {}

    private generatePassword(): string {
        const options: GenerateOptions = {
            length: 16,
            numbers: true,
            lowercase: true,
            uppercase: true,
            symbols: true,
        };
        return generate(options);
    }

    /**
     * Gets a Ping federated auth token in a header
     * @returns A PING AD Authorization header
     */
    private async getPingAuthorizationHeaderValue(): Promise<string> {
        const accessTokenHost = this.configService.get(
            Config.PING_AD_ACCESS_TOKEN_HOST,
        );
        const query = this.configService.get(Config.PING_AD_ACCESS_TOKEN_QUERY);

        const getAuthorizationCode = oauth.client(axios.create(), {
            url: `${accessTokenHost}${query}`,
            grant_type: 'client_credentials',
            client_id: this.configService.get(Config.PING_AD_CLIENT_ID),
            client_secret: this.configService.get(Config.PING_AD_CLIENT_SECRET),
            scope: this.configService.get(Config.PING_AD_SCOPE),
        });

        return getAuthorizationCode()
            .then((data) => {
                return `${data.token_type} ${data.access_token}`;
            })
            .catch((error) => {
                Logger.error(error.message);
                throw new InternalServerErrorException(
                    'Cannot get Ping authorization header code',
                );
            });
    }

    /**
     *
     * @param url URL for Ping request
     * @param method GET, POST
     * @returns
     */
    private async getPingQuery(url, method): Promise<AxiosPromise> {
        const authHeader = await this.getPingAuthorizationHeaderValue();

        const config: AxiosRequestConfig = {
            method: method,
            url: url,
            headers: {
                Authorization: authHeader,
            },
        };

        return await axios(config)
            .then(function (response) {
                Logger.debug(
                    JSON.stringify(response.data),
                    PingUsersService.name,
                );
                return response.data._embedded.entries;
            })
            .catch(function (error) {
                Logger.debug(error, PingUsersService.name);
                throw new InternalServerErrorException(
                    'Request failed to authorization provider',
                );
            });
    }

    private async sendNewAccountEmail(mail: string): Promise<void> {
        const sendNewAccountMail: SendMailCommand = new SendMailCommand(
            mail,
            '',
            'Welcome to Adopt A Highway!',
            MailTemplate.NewPingUser,
            null,
            { mail },
            null,
            null,
            null,
        );
        await this.commandBus.execute(sendNewAccountMail);
    }

    private async sendPasswordEmail(
        mail: string,
        password: string,
    ): Promise<void> {
        const sendPasswordMail: SendMailCommand = new SendMailCommand(
            mail,
            '',
            'Your temporary Adopt a Highway Password',
            MailTemplate.NewPingUserPassword,
            null,
            { password },
            [],
            null,
            null,
        );
        await this.commandBus.execute(sendPasswordMail);
    }

    /**
     *
     * @param url
     * @param data
     * @returns
     */
    async patchPingQuery(url, data): Promise<AxiosPromise> {
        const authHeader = await this.getPingAuthorizationHeaderValue();

        const config: AxiosRequestConfig = {
            method: 'patch',
            url: url,
            headers: {
                Authorization: authHeader,
            },
            data: data,
        };

        Logger.debug(
            `Axios config: ${JSON.stringify(config)}`,
            PingUsersService.name,
        );

        return await axios(config)
            .then((response) => {
                Logger.debug(
                    JSON.stringify(response.data),
                    PingUsersService.name,
                );
                return response.data;
            })
            .catch((error) => {
                Logger.error(error.message);
                throw new InternalServerErrorException(
                    'An error occurred while updating the user',
                );
            });
    }

    /**
     *
     * @param mail Email to search for
     * @returns List of users matching the mail
     */
    async getPingActiveDirectoryUsersByEmail(
        mail: string,
    ): Promise<PingEntry[]> {
        // URL for searching the subtree using an email address
        const url = `https://${this.host}/directory/v1/${this.configService.get(
            Config.PING_AD_SEARCH_SUBTREE,
        )}/subtree?searchScope=wholeSubtree&limit=100&filter=objectClass%20eq%20"User"%20and%20mail%20eq%20"${mail}"`;

        const query = await this.getPingQuery(url, 'get');
        const rv = query as unknown as PingEntry[];

        if (!rv || rv.length === 0) {
            throw new NotFoundException(`No Ping account found for ${mail}`);
        }

        return rv;
    }

    /**
     * Creates a new user with name and mail
     * @param mail email of new user
     * @param firstName full name of new user
     * @returns PingEntry of the new user
     */
    async createPingUser(
        mail: string,
        firstName: string,
        lastName: string,
    ): Promise<PingEntry> {
        const password: string = this.generatePassword();

        // URL for searching the subtree using an email address
        const url = `https://${this.host}/directory/v1`;

        const authHeader = await this.getPingAuthorizationHeaderValue();

        const config: AxiosRequestConfig = {
            method: 'post',
            url: url,
            data: {
                _dn: `mail=${mail},ou=AAH,ou=Users,dc=Public,dc=dot,dc=state,dc=tx,dc=us`,
                objectClass: ['User'],
                mail: [mail],
                sn: [`${firstName} ${lastName}`],
                cn: [`${lastName}`],
                userPassword: [`${password}`],
            },
            headers: {
                Authorization: authHeader,
            },
        };

        Logger.debug(
            `Axios config: ${JSON.stringify(config)}`,
            PingUsersService.name,
        );

        return await axios(config)
            .then((response: AxiosResponse<PingEntry>) => {
                Logger.debug(
                    JSON.stringify(response.data),
                    PingUsersService.name,
                );
                return response.data;
            })
            .then(async (user: PingEntry) => {
                Logger.debug(
                    `Send new account created email`,
                    PingUsersService.name,
                );
                await this.sendNewAccountEmail(user.mail[0]);
                return user;
            })
            .then(async (user: PingEntry) => {
                Logger.debug(`Send password email`, PingUsersService.name);
                await this.sendPasswordEmail(user.mail[0], password);
                return user;
            })
            .then((user: PingEntry) => user)
            .catch(function (error) {
                Logger.debug(error);
                throw new InternalServerErrorException(
                    'An error occurred while creating the user',
                );
            });
    }

    async deletePingUser(user: PingEntry): Promise<void> {
        Logger.debug(`Deleting user with _dn: ${user._dn}`);

        // URL for searching the subtree using _dn
        const url = `https://${this.host}/directory/v1/${user._dn}`;

        const authHeader = await this.getPingAuthorizationHeaderValue();

        const config: AxiosRequestConfig = {
            method: 'delete',
            url: url,
            headers: {
                Authorization: authHeader,
            },
        };

        Logger.debug(
            `Axios config: ${JSON.stringify(config)}`,
            PingUsersService.name,
        );

        await axios(config)
            .then((response: AxiosResponse<any, any>) => {
                Logger.debug(
                    ` delete complete. response: \n${JSON.stringify(
                        response.data,
                    )}`,
                    PingUsersService.name,
                );
            })
            .catch((error: Error) => {
                Logger.error(error, PingUsersService.name);
                throw new InternalServerErrorException(
                    'An error occurred while deleting the user',
                );
            });
    }
}
