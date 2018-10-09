
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer, ContentData } from '../data';
import links from '../links';
import { canonical } from '../utils';
import { QSMessage } from '../qsMessage';

const route: Router = Router();

export default route;

//index

route.get('/', function (_req: Request, res: Response, next: NextFunction) {

    // const culture = res.locals.culture;
    const __ = res.locals.__;

    res.locals.site.head.title = __('home_page_title');
    res.locals.site.head.description = __('home_page_description');
    res.locals.site.head.keywords = __('home_page_keywords');

    res.locals.currentPageLink = links.home();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    // dc.push('articleCollection', Data.articles({ limit: 10, order: '-createdAt' }));

    // dc.push('shopProducts', ContentData.shopProducts({ limit: 8, language: culture.language, order: '-createdAt' }));

    dc.getData()
        .then(data => {
            res.render('index', data);
        })
        .catch(next);
});

//contact

route.get('/contact', function (req: Request, res: Response, next: NextFunction) {

    const __ = res.locals.__;
    const message = req.query.message;

    res.locals.site.head.title = __('contact_page_title');
    res.locals.site.head.description = __('contact_page_description');
    res.locals.site.head.keywords = __('contact_page_keywords');

    res.locals.currentPageLink = links.contact();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    if (message === QSMessage.INPUT_ERROR) {
        res.locals.alertMessage = __('contact_input_error');
    } else if (message === QSMessage.SUCCESS) {
        res.locals.alertMessage = __('contact_success');
    }

    dc.getData()
        .then(data => {
            res.render('contact', data);
        })
        .catch(next);
});
