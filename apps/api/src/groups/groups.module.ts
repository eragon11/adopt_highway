import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupSponsor } from 'src/entities';
import { GroupQueryHandlers } from '.';
import { GroupsController } from './groups.controller';

@Module({
    imports: [TypeOrmModule.forFeature([GroupSponsor])],
    controllers: [GroupsController],
    providers: [...GroupQueryHandlers],
})
export class GroupsModule {}
