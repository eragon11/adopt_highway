import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DeleteUnconfirmedAppsCommand } from 'src/applications/commands/impl';
import { CommandBus } from '@nestjs/cqrs';
import { Mutex } from 'async-mutex';
import { UpdateLatestDocuSignDocumentStatusesCommand } from 'src/applications';

@Injectable()
export class CronService {
    private readonly logger = new Logger(CronService.name);
    private readonly docStatusMutex = new Mutex();
    private readonly deleteUnconfirmedMutex = new Mutex();

    constructor(private readonly commandBus: CommandBus) {}

    private async deleteUnconfirmedApplications() {
        try {
            this.logger.log(
                'Starting task to delete unconfirmed applications (every night at 2am)',
            );
            const command = new DeleteUnconfirmedAppsCommand();
            await this.commandBus.execute(command);
            this.logger.log(
                'Starting task to delete unconfirmed applications (every night at 2am)',
            );
            return;
        } catch (err) {
            this.logger.error('Could not delete unconfirmed applications');
        }
    }

    private async updateDocumentStatuses() {
        try {
            this.logger.log(
                'Starting task scheduler to check on latest DocuSign statuses',
            );
            await this.commandBus.execute(
                new UpdateLatestDocuSignDocumentStatusesCommand(
                    'Updating to latest statuses',
                ),
            );
            this.logger.log(
                'Retrieved and updated latest DocuSign document statuses',
            );
        } catch (err) {
            this.logger.error(err);
            this.logger.error('Could not update latest document statuses');
        }
    }

    /**
     * Starts the cron task scheduler for deleting unconfirmed application every night at 2am CST
     */
    @Cron('0 2 * * * ', {
        name: 'deleteApplicationAfter24hrs',
        timeZone: 'US/Central',
    })
    async deleteApplicationAfter24hrs() {
        await this.deleteUnconfirmedMutex.runExclusive(async () => {
            await this.deleteUnconfirmedApplications();
        });
    }

    /**
     * Request latest DocuSign document statuses every ten minutes
     */
    @Cron('*/10 * * * *', {
        name: 'requestLatestDocuSignStatuses',
        timeZone: 'US/Central',
    })
    async requestLatestDocuSignStatuses() {
        await this.docStatusMutex.runExclusive(async () => {
            await this.updateDocumentStatuses();
        });
    }
}
