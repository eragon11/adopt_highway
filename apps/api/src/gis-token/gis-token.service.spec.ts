import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { GisTokenService } from './gis-token.service';

describe('GisTokenService', () => {
    let service: GisTokenService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [GisTokenService],
            imports: [HttpModule],
        }).compile();

        service = module.get<GisTokenService>(GisTokenService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
