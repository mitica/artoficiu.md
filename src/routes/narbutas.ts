
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer, NarbutasStorage } from '../data';
import { Menu as NarbutasMenu } from '../catalog/narbutas/menu';
import links from '../links';
import { canonical } from '../utils';
import { PageType } from '../catalog/narbutas/page';

const route: Router = Router();

export default route;

//narbutas

route.get('/narbutas/:id', function (req: Request, res: Response, next: NextFunction) {

    const id = (req.params.id as string).toLowerCase();
    const __ = res.locals.__;
    const dc: DataContainer = res.locals.dataContainer;

    NarbutasStorage.getPage(id).then(page => {
        if (!page) {
            const error: any = new Error(`Not found narbutas page ${id}`)
            error.statusCode = 404;
            return next(error);
        }

        res.locals.page = page;

        res.locals.currentPageLink = links.narbutas.page(page.id);
        res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

        res.locals.site.head.title = __('narbutas') + ': ' + (page.title || page.name);
        res.locals.site.head.description = page.title;

        if (page.type === PageType.CATEGORY) {
            const items = NarbutasMenu.getItems(page.id);

            return Promise.all(items.map(item => NarbutasStorage.getPage(item.id)))
                .then(pages => {
                    if (!pages) {
                        const error: any = new Error(`Not found narbutas pages ${id}`)
                        error.statusCode = 404;
                        return next(error);
                    }
                    res.locals.pages = pages;
                    return dc.getData()
                        .then(data => {
                            res.render('narbutas-category', data);
                        });
                });
        } else {
            return dc.getData()
                .then(data => {
                    res.render('narbutas-page', data);
                });
        }
    })
        .catch(next);
});
