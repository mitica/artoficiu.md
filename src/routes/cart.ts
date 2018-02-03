
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer } from '../data';
import links from '../links';
import { canonical } from '../utils';

const route: Router = Router();

export default route;

//cart

route.get('/cart', function (_req: Request, res: Response, next: NextFunction) {

    const __ = res.locals.__;

    res.locals.site.head.title = __('shop_cart');

    res.locals.currentPageLink = links.cart();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc = res.locals.dataContainer as DataContainer;

    dc.getData()
        .then(data => {
            res.render('cart', data);
        })
        .catch(next);
});

//checkout

route.get('/checkout', function (_req: Request, res: Response, next: NextFunction) {

    const __ = res.locals.__;

    res.locals.site.head.title = __('finish_purchase');

    res.locals.currentPageLink = links.checkout();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc = res.locals.dataContainer as DataContainer;

    dc.getData()
        .then(data => {
            res.render('checkout', data);
        })
        .catch(next);
});
