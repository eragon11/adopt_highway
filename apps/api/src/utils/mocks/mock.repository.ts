import { Mapper } from '@automapper/core';
import { createMock } from '@golevelup/nestjs-testing';
import { Connection, Repository } from 'typeorm';

export const repositoryMockValue = createMock<Repository<any>>();

export const mapperMockValue = createMock<Mapper>();

export const connectionMockValue = createMock<Connection>();
