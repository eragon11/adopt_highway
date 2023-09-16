import { getMapperToken } from '@automapper/nestjs';
import { createMock } from '@golevelup/nestjs-testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
    mapperMockValue,
    repositoryMockValue,
} from 'src/utils/mocks/mock.repository';

import { User } from '../entities/user.entity';
import { UserService } from './users.service';

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getMapperToken(),
                    useValue: mapperMockValue,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: repositoryMockValue,
                },
                {
                    provide: EventEmitter2,
                    useValue: createMock<EventEmitter2>(),
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
