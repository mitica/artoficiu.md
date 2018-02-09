
const _package = require('../../package.json');
const debug = require('debug')('artoficiu-web');
import { format } from 'util';
import { moment, formatNumber, imageIconUrl, selfCanonical } from '../utils';
import renderArticle from '../renderArticle';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { DataContainer, ContentData } from '../data';
import links from '../links';
import { createEmptyCartData, CartData } from '../cart';

const util = {
    moment: moment,
    format: format,
    renderArticle: renderArticle,
    formatNumber,
    imageIconUrl,
    selfCanonical,
};

export default function (req: Request, res: Response, next: NextFunction) {

    const __ = res.__;
    const culture = res.locals.culture = {
        language: req.locale,
    }

    if (!req.session.Cart) {
        debug(`No cart in session`);
        req.session.Cart = createEmptyCartData() as CartData;
    }

    res.locals.Cart = req.session.Cart;

    const localeCountry = 'MD';

    res.locals.culture.locale = `${res.locals.culture.language}_${localeCountry}`;

    res.locals.noGoogleAds = false;

    res.locals.site = {
        version: _package.version,
        name: config.name,
        head: {},
        platform: 'desktop',
    };

    res.locals.util = util;

    res.locals._events = [];

    const dc = res.locals.dataContainer = new DataContainer();

    dc.push('pageMenu', createPageMenu());
    dc.push('settings', ContentData.appSettings({ language: culture.language }).then(settings => {
        if (!settings) {
            // throw new Error(`WebAppSettings not created. Please, create one.`)
            settings = {id: null}
        }

        return settings;
    }));

    function createPageMenu() {
        let menu: { link: string, text: string, title?: string }[] = [{
            link: links.home(),
            text: __('index'),
        }, {
            link: links.catalog(),
            text: __('catalog'),
        }];
        return ContentData.pages({ limit: 10, language: culture.language }).then(pages => {
            menu = menu.concat(pages && pages.items && pages.items.map(item => {
                return {
                    link: links.page(item.slug),
                    text: item.shortTitle || item.title,
                }
            }));

            menu = menu.concat([{
                link: links.articles(),
                text: __('articles'),
            }, {
                link: links.contact(),
                text: __('contact'),
            }]);

            return menu;
        });
    }

    next();
};
