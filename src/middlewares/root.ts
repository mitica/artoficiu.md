
const _package = require('../../package.json');
const debug = require('debug')('artoficiu');
import { format } from 'util';
import { moment } from '../utils';
import renderArticle from '../renderArticle';
import { Request, Response, NextFunction } from 'express';
import config from '../config';
import { DataContainer, Data } from '../data';
import links from '../links';

const util = {
    moment: moment,
    format: format,
    renderArticle: renderArticle,
};

export default function (req: Request, res: Response, next: NextFunction) {

    const __ = res.__;
    const culture = res.locals.culture = {
        language: req.locale,
    }

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
    dc.push('shopCategories', Data.shopCategories({ limit: 10, language: culture.language }));
    dc.push('pageMenu', createPageMenu());
    dc.push('latestArticles', Data.articles({ limit: 5, language: culture.language }));
    dc.push('settings', Data.appSettings({ language: culture.language }).then(settings => {
        if (!settings) {
            throw new Error(`WebAppSettings not created. Please, create one.`)
        }
        debug('settings', settings.desktopHomepageSlider.items);

        return settings;
    }));

    dc.push('promotedShopCategories',
        Data.shopCategories({ limit: 3, language: culture.language, isPromoted: true })
            .then(categories => {
                if (categories && categories.items && categories.items.length) {
                    const tasks: any[] = [];
                    categories.items.forEach(item => tasks.push(Data.shopProducts({ limit: 4, language: culture.language, categoryId: item.id, order: '-createdAt' })));

                    return Promise.all(tasks)
                        .then(results => results.forEach((collection, i) => categories.items[i].topProducts = collection))
                        .then(() => categories);
                }
                return categories;
            })
    );

    function createPageMenu() {
        let menu: { link: string, text: string, title?: string }[] = [{
            link: links.home(),
            text: __('index'),
        }, {
            link: links.catalog(),
            text: __('catalog'),
        }];
        return Data.pages({ limit: 10, language: culture.language }).then(pages => {
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
