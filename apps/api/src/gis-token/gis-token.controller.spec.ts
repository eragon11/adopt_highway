import { Test, TestingModule } from '@nestjs/testing';

import { GisTokenController } from './gis-token.controller';

import { GisTokenService } from './gis-token.service';

describe('GisTokenController', () => {
    let controller: GisTokenController;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [GisTokenController],
            providers: [
                {
                    provide: GisTokenService,
                    useValue: {
                        getToken: jest.fn(() => 'SOME TOKEN VALUE'), // TODO REPLACE THIS RETURN OR REMOVE
                    },
                },
            ],
        }).compile();
        controller = module.get<GisTokenController>(GisTokenController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
