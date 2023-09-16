import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Agreement, DocusignDocument } from 'src/entities';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';
import { AgreementsService } from './agreements.service';
import { Logger } from '@nestjs/common';

describe('AgreementsService', () => {
    let service: AgreementsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AgreementsService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(DocusignDocument),
                    useValue: repositoryMockValue,
                },
                {
                    provide: getRepositoryToken(Agreement),
                    useValue: repositoryMockValue,
                },
                {
                    provide: ConfigService,
                    useValue: createMock<ConfigService>(),
                },
                {
                    provide: Logger,
                    useValue: {
                        debug: jest.fn(),
                        error: jest.fn(),
                        log: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AgreementsService>(AgreementsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
