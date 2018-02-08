
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer, OrdersRepository } from '../data';
import * as htmlPdf from 'html-pdf';
import links from '../links';
import { ReadStream } from 'fs';
import fetch from 'node-fetch';
import { selfCanonical } from '../utils';

const route: Router = Router();

export default route;

//cart

route.get('/invoices/:id.html', function (req: Request, res: Response, next: NextFunction) {

    const orderId = parseInt(req.params.id);

    const dc = res.locals.dataContainer as DataContainer;
    dc.push('order', OrdersRepository.getById(orderId));

    dc.getData()
        .then(data => {
            if (!data.order) {
                const error: any = new Error(`Not found order ${orderId}`)
                error.statusCode = 404;
                return next(error);
            }
            res.render('invoice', data);
        })
        .catch(next);
});

route.get('/invoices/:id.pdf', function (req: Request, res: Response, next: NextFunction) {

    const orderId = parseInt(req.params.id);

    const dc = res.locals.dataContainer as DataContainer;
    dc.push('order', OrdersRepository.getById(orderId));

    dc.getData()
        .then((data: any) => {
            if (!data.order) {
                const error: any = new Error(`Not found order ${orderId}`)
                error.statusCode = 404;
                return next(error);
            }

            return createPdf(orderId).then(stream => {
                stream.pipe(res)
            });
        })
        .catch(next);
});

function createPdf(orderId: number): Promise<ReadStream> {
    const url = selfCanonical(links.invoices.invoice(orderId));
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            return new Promise<ReadStream>((resolve, reject) => {
                htmlPdf.create(html, {
                    format: 'A4', border: '1cm',
                }).toStream((error, stream) => {
                    if (error) {
                        return reject(error);
                    }
                    resolve(stream);
                })
            });
        });
}
