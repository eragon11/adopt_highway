import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { Url } from 'url';
import { MailTemplate } from '../command/impl/send-mail.command';

export class AahMailAttachment {
    @IsOptional()
    @AutoMap()
    @AutoMap({ typeFn: () => String })
    filename?: string | false | undefined;

    @IsOptional()
    @AutoMap()
    content?: string;

    @IsOptional()
    @AutoMap()
    @AutoMap({ typeFn: () => String })
    encoding?: 'base64' | 'hex' | 'binary' | undefined;

    @IsOptional()
    @IsUrl()
    @AutoMap({ typeFn: () => String })
    path?: string | Url | undefined;
}

export class SendMailDto {
    @ApiProperty()
    @IsEmail({}, { each: true })
    @AutoMap()
    to: string[];

    @ApiProperty()
    @IsEmail()
    @AutoMap()
    from: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    @AutoMap()
    cc?: string;

    @ApiProperty()
    @IsNotEmpty()
    @AutoMap()
    subject: string;

    @ApiProperty()
    @AutoMap({ typeFn: () => String })
    @IsOptional()
    text: string;

    @ApiProperty()
    @IsOptional()
    @IsEmail()
    @AutoMap()
    bcc?: string;

    @ApiProperty()
    @IsOptional()
    @AutoMap({ typeFn: () => String })
    template?: MailTemplate;

    @ApiProperty()
    @AutoMap({ typeFn: () => Object })
    @IsOptional()
    context: any;

    @ApiProperty()
    @IsOptional()
    @AutoMap({ typeFn: () => AahMailAttachment })
    attachments?: AahMailAttachment[] | undefined;
}
