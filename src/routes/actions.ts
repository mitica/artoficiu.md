
import { Router, Request, Response } from 'express';
import config from '../config';
import { ContentData, OrdersRepository } from '../data';
import { CartData } from '../cart';
import { ShopProductVariantEntity } from '../content/entities';
import logger from '../logger';
import { CartHelpers } from '../cart/cartHelpers';
import links from '../links';
import { sendEmail } from '../emailSender';
import { QSMessage } from '../qsMessage';
import * as util from 'util';
import recaptchaValidate from '../recaptcha';
import { remoteIp, canonical } from '../utils';
import { createOrderFromCartData, Order } from '../orders/order';
import { createCustomerFromPostData, Customer } from '../orders/customer';
import { parse as parseUrl } from 'url';
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


route.get('/actions/cart/remove/:id', function (req: Request, res: Response) {

    const id = req.params.id;

    const cart = req.session.Cart as CartData;

    CartHelpers.removeItem(cart, id)

    new Promise<any>(resolve => {
        req.session.save(error => {
            if (error) {
                return logger.error(error);
            }
            resolve();
        });
    }).then(_ => {
        const ref = req.get('Referrer') || '/';
        res.redirect(ref)
    })
})

route.post('/actions/cart/add', function (req: Request, res: Response) {

    const productId = req.query.productId || req.query.productid || req.query.product_id;
    const variantId = req.query.variantId || req.query.variantid || req.query.variant_id;
    const quantity = parseInt(req.query.quantity || 0);

    const __ = res.locals.__;
    const culture = res.locals.culture;

    if (quantity < 1 || !productId) {
        return cartErrors(res, __('cart_error_invalid_input'));
    }

    ContentData.shopProduct({ language: culture.language, id: productId })
        .then(product => {
            if (!product) {
                return cartErrors(res, __('cart_error_invalid_product'));
            }
            let variant: ShopProductVariantEntity;
            if (variantId) {
                if (!product.variants) {
                    return cartErrors(res, __('cart_error_invalid_product_variant'));
                }
                variant = product.variants.find(item => item.id === variantId);
                if (!variant) {
                    return cartErrors(res, __('cart_error_invalid_product_variant'));
                }
            }

            const Cart = req.session.Cart as CartData;
            CartHelpers.addItem(Cart, {
                product: product,
                quantity: quantity,
                variant: variant,
            });

            return new Promise<any>((resolve, reject) => {
                req.session.save(error => {
                    if (error) {
                        return reject(error);
                    }
                    res.send({
                        data: { quantity: Cart.quantity }
                    });
                    resolve();
                });
            });
        })
        .catch((error: any) => {
            logger.error(error);
            cartErrors(res, __('server_error'));
        });
});

function cartErrors(res: Response, errors: string | string[]) {
    errors = Array.isArray(errors) ? errors : [errors];

    res.send({
        errors: errors
    });
}

route.post('/actions/email_us', function (req: Request, res: Response) {

    const __ = res.locals.__;
    const contact = req.body.contact;
    const name = req.body.name;
    const message = `${req.body.message}\n\n----\ncontact: ${contact} ${name || ''}`;
    const recaptchaValue = req.body['g-recaptcha-response'];
    const prevUrl = parseUrl(req.header('referer')).pathname;

    let subject = req.body.subject || util.format(__('message_from_format'), contact);


    if (!contact || !message || !recaptchaValue) {
        logger.error(`contact us invalid params`, { name, message, contact });
        return res.redirect(links.contact({ message: QSMessage.INPUT_ERROR }));
    }

    const ip = remoteIp(req);

    function formatRedurectUrl(message: string) {
        return prevUrl + '?message=' + encodeURIComponent(message);
    }

    recaptchaValidate(recaptchaValue, ip).then(isHuman => {
        if (!isHuman) {
            logger.error(`A robbot tries to contact you ${ip}`);
            return false;
        }



        sendEmail({
            from: config.email,
            to: config.email,
            subject,
            text: message,
        }).catch(error => logger.error(error));

        return true;
    })
        .then(result => {
            if (result) {
                return res.redirect(formatRedurectUrl(QSMessage.SUCCESS))
            }
            return res.redirect(formatRedurectUrl(QSMessage.INPUT_ERROR));
        })
        .catch(error => {
            logger.error(error)
            res.redirect(formatRedurectUrl(QSMessage.SUCCESS))
        });
});

route.post('/actions/checkout', function (req: Request, res: Response) {

    const __ = res.locals.__;
    let customer: Customer;
    let order: Order;
    const cart = req.session.Cart as CartData;
    try {
        customer = createCustomerFromPostData(req.body);
        order = createOrderFromCartData(cart, customer, req.body.comments);
    } catch (error) {
        logger.error(error);
        return res.redirect(links.checkout({ message: QSMessage.INPUT_ERROR }));
    }

    OrdersRepository.create(order)
        .then(createdOrder => {
            new Promise<any>((resolve, reject) => {
                req.session.destroy(error => {
                    if (error) {
                        return reject(error);
                    }
                    resolve();
                });
            })
                .catch(error => logger.error(error));

            if (!createdOrder) {
                throw new Error(`Not created db order!`);
            }

            const emailSubject = __('invoice_email_subject');
            const emailBody = __('invoice_email_body').replace('${invoice_pdf_link}', canonical(links.invoices.invoicePdf(createdOrder.id)));

            sendEmail({
                to: [createdOrder.customer.email],
                subject: emailSubject,
                text: emailBody,
            }).catch(error => logger.error(error))

            return res.redirect(links.checkout.success());
        })
        .catch(error => {
            logger.error(error);
            return res.redirect(links.checkout({ message: QSMessage.SYSTEM_ERROR }));
        })
});
