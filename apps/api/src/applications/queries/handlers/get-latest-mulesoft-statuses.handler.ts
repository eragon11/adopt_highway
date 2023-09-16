import { HttpService } from '@nestjs/axios';
import {
    HttpStatus,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { AxiosResponse, AxiosError } from 'axios';
import { Guid } from 'guid-typescript';
import { catchError, lastValueFrom, map } from 'rxjs';
import { ApplicationTokenDto, DocumentStatusDto } from 'src/applications/dto';
import { Config } from 'src/common';
import { GetLatestMulesoftStatusesQuery } from '../impl';

@QueryHandler(GetLatestMulesoftStatusesQuery)
export class GetLatestMulesoftDocumentStatusesHandler
    implements IQueryHandler<GetLatestMulesoftStatusesQuery>
{
    private logger: Logger = new Logger(
        GetLatestMulesoftDocumentStatusesHandler.name,
    );

    constructor(
        protected readonly http: HttpService,
        protected readonly configService: ConfigService,
    ) {}

    /**
     * Returns the current statuses of pending documents
     * @returns an array of document statuses
     */
    private async getLatestAppTokenStatusesFromMuleSoft(
        applicationTokens: ApplicationTokenDto[],
    ): Promise<DocumentStatusDto[]> {
        const clientId = this.configService.get(Config.MULESOFT_CLIENT_ID);
        const clientSecret = this.configService.get(
            Config.MULESOFT_CLIENT_SECRET,
        );

        const headers = {
            'x-correlation-id': Guid.create().toString(),
            'x-source-system': 'AAH',
            client_id: clientId,
            client_secret: clientSecret,
        };

        this.logger.debug('Getting statuses from MuleSoft');

        const url = `${this.configService.get(
            Config.MULESOFT_ENDPOINT_URL,
        )}/agreements/statuses`;

        const data = await lastValueFrom(
            this.http
                .post(url, applicationTokens, {
                    headers,
                    withCredentials: true,
                })
                .pipe(
                    map((response: AxiosResponse) => {
                        return response.data as DocumentStatusDto[];
                    }),
                    catchError((error: AxiosError) => {
                        this.logger.error(`${JSON.stringify(error.message)}`);
                        switch (error.response.status) {
                            case HttpStatus.UNAUTHORIZED:
                                throw new InternalServerErrorException(
                                    'Could not sign in to the document signing service',
                                );
                            default:
                                throw new InternalServerErrorException(
                                    'Could not get latest statuses from MuleSoft due to an error on the server side',
                                );
                                break;
                        }
                    }),
                ),
        );
        return data;
    }

    /**
     * Returns the latest MuleSoft status for the tokens provided
     * @param {ApplicationTokenDto[]} query
     * @returns
     */
    async execute(
        query: GetLatestMulesoftStatusesQuery,
    ): Promise<DocumentStatusDto[]> {
        return await this.getLatestAppTokenStatusesFromMuleSoft(
            query.applicationTokens,
        );
    }
}
