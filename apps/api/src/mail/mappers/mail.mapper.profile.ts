import {
    convertUsing,
    mapFrom,
    Mapper,
    MappingProfile,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { SendMailCommand } from '../command/impl';
import { SendMailDto } from '../dtos';
import { AahMailAttachmentConverter } from './attachment.converter';

@Injectable()
export class MailMapperProfile extends AutomapperProfile {
    constructor(@InjectMapper() readonly mapper: Mapper) {
        super(mapper);
    }

    mapProfile(): MappingProfile {
        return (mapper) => {
            mapper
                .createMap(SendMailDto, SendMailCommand)
                .forMember(
                    (destination) => destination.attachments,
                    convertUsing(
                        AahMailAttachmentConverter,
                        (source: SendMailDto) => source,
                    ),
                )
                .forMember(
                    (destination) => destination.context,
                    mapFrom((source) => source.context),
                );
        };
    }
}
