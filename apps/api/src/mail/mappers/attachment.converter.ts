import { Converter } from '@automapper/core';
import { Attachment } from 'nodemailer/lib/mailer';
import { SendMailDto } from '../dtos/send-mail.dto';

/**
 * converts aah dto mail attachments to attachments...just returns the object.
 */
export const AahMailAttachmentConverter: Converter<SendMailDto, Attachment[]> =
    {
        convert(source?: SendMailDto): Attachment[] {
            return source.attachments ?? undefined;
        },
    };
