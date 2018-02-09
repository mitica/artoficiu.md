
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer } from '../data';
import links from '../links';
import { canonical } from '../utils';
import { QSMessage } from '../qsMessage';

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

route.get('/checkout', function (req: Request, res: Response, next: NextFunction) {

    const __ = res.locals.__;
    const message = req.query.message;

    res.locals.site.head.title = __('finish_purchase');

    res.locals.currentPageLink = links.checkout();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc = res.locals.dataContainer as DataContainer;

    if (message === QSMessage.INPUT_ERROR) {
        res.locals.alertMessage = __('checkout_input_error');
    } else if (message === QSMessage.SUCCESS) {
        res.locals.alertMessage = __('checkout_success');
    } else if (message === QSMessage.SYSTEM_ERROR) {
        res.locals.alertMessage = __('server_error');
    }

    dc.getData()
        .then(data => {
            res.render('checkout', data);
        })
        .catch(next);
});

//checkout/success

route.get('/checkout/success', function (req: Request, res: Response, next: NextFunction) {

    const __ = res.locals.__;
    const message = req.query.message;

    res.locals.site.head.title = __('checkout_success');

    res.locals.currentPageLink = links.checkout.success();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc = res.locals.dataContainer as DataContainer;

    if (message === QSMessage.INPUT_ERROR) {
        res.locals.alertMessage = __('checkout_input_error');
    } else if (message === QSMessage.SUCCESS) {
        res.locals.alertMessage = __('checkout_success');
    }

    dc.getData()
        .then(data => {
            res.render('checkout-success', data);
        })
        .catch(next);
});
