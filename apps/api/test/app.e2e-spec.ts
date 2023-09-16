import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        jest.setTimeout(30000);

        const testAppModule: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = testAppModule.createNestApplication();
        await app.init();
    });

    it('/ (GET)', async () => {
        await request(app.getHttpServer())
            .get('/')
            .expect(200)
            .expect(
                '<h1>SAML Passport</h1><h2><a href="/auth/login">Login</a></h2>',
            );
    });
});
