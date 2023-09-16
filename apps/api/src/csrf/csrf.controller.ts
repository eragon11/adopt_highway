import { Controller, Get, HttpCode, Req, Res } from '@nestjs/common';

/**
 * CRSF Controller
 */
@Controller('csrf')
export class CsrfController {
    /**
     * Returns a response populated with the csrf token for GET Requests
     * @param req request object
     * @param res response object
     */
    @Get('')
    @HttpCode(200)
    async getNewToken(@Req() req, @Res() res) {
        const csrfToken = req.csrfToken();
        res.send({ csrfToken });
    }
}
