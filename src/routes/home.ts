
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer } from '../data';
import links from '../links';
import { canonical } from '../utils';
import { maxageIndex } from '../maxage';

const route: Router = Router();

export default route;

//index

route.get('/', function (_req: Request, res: Response, next: NextFunction) {

    maxageIndex(res);
    const __ = res.locals.__;
    const platform = res.locals.site.platform;

    res.locals.site.head.title = __('home_page_title');
    res.locals.site.head.description = __('home_page_description');
    res.locals.site.head.keywords = __('home_page_keywords');

    res.locals.currentPageLink = links.home();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    // dc.push('articleCollection', Data.articles({ limit: 10, order: '-createdAt' }));

    dc.getData()
        .then(data => {
            res.render('index_' + platform, data);
        })
        .catch(next);
});

//contact

route.get('/contact', function (_req: Request, res: Response, next: NextFunction) {

    maxageIndex(res);
    const __ = res.locals.__;
    const platform = res.locals.site.platform;

    res.locals.site.head.title = __('contact_page_title');
    res.locals.site.head.description = __('contact_page_description');
    res.locals.site.head.keywords = __('contact_page_keywords');

    res.locals.currentPageLink = links.contact();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    dc.getData()
        .then(data => {
            res.render('contact_' + platform, data);
        })
        .catch(next);
});
