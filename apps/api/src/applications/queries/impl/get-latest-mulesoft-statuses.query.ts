import { ApplicationTokenDto } from 'src/applications/dto';

export class GetLatestMulesoftStatusesQuery {
    applicationTokens: ApplicationTokenDto[];

    constructor(tokens: ApplicationTokenDto[]) {
        this.applicationTokens = tokens;
    }
}
