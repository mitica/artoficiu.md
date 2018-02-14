
import { Router, Request, Response } from 'express';
import { maxageRedirect } from '../maxage';

const route: Router = Router();

export default route;

//index

route.get('/favicon.ico', function (_req: Request, res: Response) {
    maxageRedirect(res);
    res.redirect(301, '/static/img/favicon.png');
});
