import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Application } from 'src/applications/entities/application.entity';
import { getConnection, Repository } from 'typeorm';
import { DeleteUnconfirmedAppsCommand } from '../impl/delete-unconfirmed-apps.command';

/**
 * Handles commands for deleting unconfirmed applications that are over 24hrs old
 */
@CommandHandler(DeleteUnconfirmedAppsCommand)
export class DeleteUnconfirmedAppsCommandHandler
    implements ICommandHandler<DeleteUnconfirmedAppsCommand>
{
    constructor(
        private readonly configService: ConfigService,
        private readonly commandBus: CommandBus,
        @InjectRepository(Application)
        private readonly appRepository: Repository<Application>,
    ) {}
    private readonly logger = new Logger(
        DeleteUnconfirmedAppsCommandHandler.name,
    );

    /**
     * Deletes all applications that have not been confirmed within 24hrs
     */
    async deleteUnconfirmedApplication() {
        const connection = await getConnection();
        const queryRunner = await connection.createQueryRunner();

        await queryRunner.startTransaction();

        try {
            await queryRunner.manager
                .getRepository(Application)
                .createQueryBuilder('a')
                .delete()
                .where('CREATED_ON <= DATEADD(hh, -24, GETDATE())')
                .andWhere("STATUS = 'Not confirmed'")
                .execute();

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                `Could not delete unconfirmed application(s).
                Rolling back database changes:\n${err.message}`,
                'DeleteUnconfirmedAppsCommandHandler',
            );
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * Executes theDeleteUnconfirmedApplicationCommand
     * @param {DeleteUnconfirmedAppsCommand} command
     * @returns void
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async execute(command: DeleteUnconfirmedAppsCommand): Promise<void> {
        try {
            const currentTime = new Date();
            this.logger.log(
                `Deleting all applications that have not been confirmed within 24hrs at this time: ${currentTime}`,
            );

            await this.deleteUnconfirmedApplication();

            return;
        } catch (err) {
            this.logger.error(err.message);
            throw err;
        }
    }
}
