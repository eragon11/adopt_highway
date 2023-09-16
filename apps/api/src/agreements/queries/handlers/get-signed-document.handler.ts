import { Response } from 'express';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import {
    GetActiveAgreementByIdForUserQuery,
    GetSignedDocumentQuery,
} from '../impl';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/common';
import {
    InternalServerErrorException,
    Logger,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Agreement, User } from 'src/entities';
import { GetObjectCommand, S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import internal from 'stream';

@QueryHandler(GetSignedDocumentQuery)
export class GetSignedDocumentHandler
    implements IQueryHandler<GetSignedDocumentQuery>
{
    private readonly logger: Logger = new Logger(GetSignedDocumentHandler.name);

    RETRIEVAL_ERROR = 'Could not retrieve PDF for this agreement';

    /**
     *
     */
    constructor(
        private readonly configService: ConfigService,
        private readonly queryBus: QueryBus,
    ) {}

    private async getTemplateAndFileNameFromAgreementId(
        agreementId: number,
        currentUser: User,
    ): Promise<{ templateName: string; fileName: string }> {
        const agreement = (await this.queryBus.execute(
            new GetActiveAgreementByIdForUserQuery(agreementId, currentUser),
        )) as Agreement;

        if (!agreement || agreement.documents.length === 0) {
            throw new UnprocessableEntityException(
                'There is no document for agreement Id: ${agreementId}',
            );
        }

        const templateName = agreement.documents[0]?.templateName.toLowerCase();
        const fileName = `AAH_${agreement.groupSponsor?.name}_New Agreement.pdf`;

        return {
            templateName: templateName,
            fileName: fileName,
        };
    }

    private getAwsConfig(): S3ClientConfig {
        const accessKeyId = this.configService.get(
            Config.AWS_BUCKET_ACCESS_KEY_ID,
        );
        const secretAccessKey = this.configService.get(
            Config.AWS_BUCKET_SECRET_KEY,
        );
        const region = this.configService.get(Config.AWS_BUCKET_REGION);
        const awsConfig: S3ClientConfig = {
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        };
        Logger.debug(`AWS config: ${JSON.stringify(awsConfig)}`);
        return awsConfig;
    }

    private async downloadFile(
        response: Response,
        bucketName: string,
        objectKey: string,
        fileName: string,
    ) {
        const client = new S3Client(this.getAwsConfig());
        const disposition = `filename="${encodeURI(fileName)}"; `;
        const dispositionEncoding = 'charset=UTF-8';

        response.setHeader(
            'Content-Disposition',
            `attachment; ${disposition}${dispositionEncoding}`,
        );
        response.setHeader('Content-Type', 'application/pdf');

        try {
            const commandResult = await client.send(
                new GetObjectCommand({ Bucket: bucketName, Key: objectKey }),
            );
            if (commandResult.Body instanceof internal.Readable) {
                const readableStream: internal.Readable =
                    commandResult.Body as internal.Readable;
                readableStream.pipe(response);
            }
        } catch (error) {
            this.logger.error(`${JSON.stringify(error)}`);
            if (error.name === 'NoSuchKey') {
                throw new NotFoundException('Could not find document');
            }

            throw new InternalServerErrorException(
                `Could not download file from S3 bucket ${bucketName} for key: ${objectKey}`,
            );
        }
    }

    async execute(query: GetSignedDocumentQuery) {
        const bucket = this.configService.get(Config.AWS_BUCKET);
        const bucketKey = this.configService.get(Config.AWS_BUCKET_KEY);

        const { templateName, fileName } =
            await this.getTemplateAndFileNameFromAgreementId(
                query.agreementId,
                query.currentUser,
            );

        // the MuleSoft envelopeID gets stored as the DOCUMENT.TEMPLATE_NAME
        // and is stored on AWS S3 in our bucket
        const key = `${bucketKey}/${templateName}.pdf`;

        await this.downloadFile(query.response, bucket, key, fileName);
    }
}
