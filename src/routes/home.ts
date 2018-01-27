
import { Router, Request, Response, NextFunction } from 'express';
import { Data, DataContainer } from '../data';
import links from '../links';
import { canonical } from '../utils';
import { maxageIndex, maxageArticle } from '../maxage';

const route: Router = Router();

export default route;

//index

route.get('/', function (_req: Request, res: Response, next: NextFunction) {

    maxageIndex(res);
    const __ = res.locals.__;

    res.locals.site.head.title = __('home_page_title');
    res.locals.site.head.description = __('home_page_description');
    res.locals.site.head.keywords = __('home_page_keywords');

    res.locals.site.head.canonical = canonical(links.home());

    const dc: DataContainer = res.locals.dataContainer;

    // dc.push('articleCollection', Data.articles({ limit: 10, order: '-createdAt' }));

    dc.getData()
        .then(data => {
            res.render('index', data);
        })
        .catch(next);
});

route.get('/page/:slug', function (req: Request, res: Response, next: NextFunction) {

    const culture = res.locals.culture;
    const slug = req.params.slug;
    // const __ = res.locals.__;

    const dc: DataContainer = res.locals.dataContainer;

    Data.page({ slug: slug, language: culture.language })
        .then(page => {
            if (!page) {
                const error: any = new Error(`Not found page ${slug}`)
                error.statusCode = 404;
                return next(error);
            }
            res.locals.page = page;
            res.locals.site.head.title = page.title;
            res.locals.site.head.description = page.summary;
            res.locals.site.head.canonical = canonical(links.page(page.slug));
            res.locals.site.head.image = page.image.url;

            maxageArticle(res);

            return dc.getData()
                .then(data => {
                    res.render('article', data);
                });
        })
        .catch(next);
});

route.get('/article/:slug', function (req: Request, res: Response, next: NextFunction) {

    const culture = res.locals.culture;
    const slug = req.params.slug;
    // const __ = res.locals.__;

    const dc: DataContainer = res.locals.dataContainer;

    Data.article({ slug: slug, language: culture.language })
        .then(article => {
            if (!article) {
                const error: any = new Error(`Not found article ${slug}`)
                error.statusCode = 404;
                return next(error);
            }
            res.locals.article = article;
            res.locals.site.head.title = article.title;
            res.locals.site.head.description = article.summary;
            res.locals.site.head.canonical = canonical(links.article(article.slug));
            res.locals.site.head.image = article.image.url;

            maxageArticle(res);

            return dc.getData()
                .then(data => {
                    res.render('article', data);
                });
        })
        .catch(next);
});
