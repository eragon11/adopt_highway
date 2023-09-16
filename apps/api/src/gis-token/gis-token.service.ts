import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import FormData from 'form-data';
import { MappingServiceUnavailableException } from './exceptions';

@Injectable()
export class GisTokenService {
    constructor(private readonly http: HttpService) {}

    async getAuthenticationToken(options: any) {
        try {
            const bodyFormData = new FormData();
            bodyFormData.append('userName', process.env.gis_username);
            bodyFormData.append('password', process.env.gis_password);
            bodyFormData.append('referer', options.appUrl);

            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

            const data = this.http
                .post(
                    `${process.env.GIS_PORTAL_URL}/sharing/rest/generateToken/?f=json`,
                    bodyFormData,
                    {
                        headers: bodyFormData.getHeaders(),
                        withCredentials: true,
                    },
                )
                .pipe(
                    map((res) => {
                        return res.data;
                    }),
                );
            return await lastValueFrom(data);
        } catch (err) {
            Logger.error(
                `GIS Token service threw an error: ${JSON.stringify(
                    err.message,
                )}`,
                GisTokenService.name,
            );
            throw new MappingServiceUnavailableException();
        }
    }
}
