
import { Router, Request, Response } from 'express';
import config from '../config';
const ms = require('ms');

const route: Router = Router();

export default route;

//index

route.get('/actions/set_language/:lang', function (req: Request, res: Response) {

    const lang = req.params.lang;

    if (~config.languages.indexOf(lang)) {
        res.cookie('ul', lang, {
            // domain: config.domain,
            maxAge: ms('3m'),
            path: null,
        });
    }

    const ref = req.get('Referrer') || '/';

    res.redirect(ref);
});
