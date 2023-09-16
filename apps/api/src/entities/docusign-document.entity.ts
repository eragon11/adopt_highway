import { AutoMap } from '@automapper/classes';
import { DocumentStatus } from 'src/common';
import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Agreement } from '.';

@Entity({ name: 'DOCUMENT', schema: process.env.DB_SCHEMA })
export class DocusignDocument {
    @PrimaryGeneratedColumn('increment', { name: 'DOCUMENT_ID' })
    @AutoMap({ typeFn: () => Number })
    id: number;

    @ManyToOne(() => Agreement, (agreement) => agreement.documents, {
        eager: false,
        cascade: false,
    })
    @JoinColumn([{ name: 'AGREEMENT_ID' }])
    @AutoMap()
    agreement: Agreement;

    @Column('nvarchar', {
        name: 'TEMPLATE_NAME',
        length: 3000,
    })
    templateName: string;

    @Column('datetime2', {
        name: 'SENT_DATE',
        default: Date.now(),
    })
    sentDate: Date;

    @Column('varchar', { name: 'APPLICATION_TOKEN' })
    applicationToken: string;

    @Column({
        type: 'simple-enum',
        enum: DocumentStatus,
        default: DocumentStatus.Sent,
        name: 'STATUS',
        length: 50,
    })
    status: DocumentStatus;
}
