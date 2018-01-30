
import logger from './logger';
import { maxage } from './maxage';
import { Request, Response } from "express";

export default function catchError(req: Request, res: Response, error: any) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    logger.error(error.message || 'errorHandler', {
        hostname: req.hostname,
        url: req.originalUrl,
        error: error,
        ip: ip,
        ref: req.get('Referrer')
    });

    maxage(res, 5);

    const __ = res.locals.__;

    let statusCode = error.statusCode || error.code || 500;
    statusCode = statusCode < 200 ? 500 : statusCode;

    res.status(statusCode);

    const data = {
        statusCode: statusCode,
        title: __('error_page_title'),
        description: __('error_page_description')
    };

    res.locals.site.title = data.title;
    res.locals.site.description = data.description;

    res.locals._events.push({
        category: 'errors',
        action: 'error-' + statusCode,
        label: error.message,
        value: 0
    });

    res.render('error_' + (res.locals.site && res.locals.site.platform || 'desktop'), { error: error, data: data });
}
