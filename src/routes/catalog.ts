
import { Router, Request, Response, NextFunction } from 'express';
import { DataContainer, ContentData } from '../data';
import links from '../links';
import { canonical } from '../utils';
import { ShopProductEntity } from '../content/entities';

const route: Router = Router();

export default route;

//catalog

route.get('/catalog', function (_req: Request, res: Response, next: NextFunction) {

    const culture = res.locals.culture;
    const __ = res.locals.__;

    res.locals.site.head.title = __('catalog_page_title');
    res.locals.site.head.description = __('catalog_page_description');
    res.locals.site.head.keywords = __('catalog_page_keywords');

    res.locals.currentPageLink = links.catalog();
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    dc.push('shopProducts', ContentData.shopProducts({ limit: 16, language: culture.language, order: '-createdAt' }));

    dc.getData()
        .then(data => {
            res.render('catalog', data);
        })
        .catch(next);
});

//catalog/:category

route.get('/catalog/:category', function (req: Request, res: Response, next: NextFunction) {

    const categorySlug = req.params.category;
    const culture = res.locals.culture;
    const __ = res.locals.__;

    res.locals.currentPageLink = links.catalog.category(categorySlug);
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    dc.push('selectedShopCategory', ContentData.shopCategory({ language: culture.language, slug: categorySlug }));

    dc.getData()
        .then(data => {
            if (!data.selectedShopCategory) {
                const error: any = new Error(`Not found category ${categorySlug}`)
                error.statusCode = 404;
                return next(error);
            }
            res.locals.site.head.title = __('catalog') + ' / ' + data.selectedShopCategory.title;
            return ContentData.shopProducts({ limit: 16, language: culture.language, order: '-createdAt', categoryId: data.selectedShopCategory.id })
                .then(shopProducts => {
                    data.shopProducts = shopProducts;
                    res.render('catalog', data);
                })
        })
        .catch(next);
});

//catalog/item

route.get('/catalog/item/:slug', function (req: Request, res: Response, next: NextFunction) {

    const slug = req.params.slug;
    const culture = res.locals.culture;
    // const __ = res.locals.__;

    res.locals.currentPageLink = links.catalog.item(slug);
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    dc.push('product', ContentData.shopProduct({ language: culture.language, slug: slug }));

    dc.getData()
        .then(data => {
            const product:ShopProductEntity=data.product;
            if (!product) {
                const error: any = new Error(`Not found product ${slug}`)
                error.statusCode = 404;
                return next(error);
            }

            res.locals.site.head.title = product.title;

            // console.log(JSON.stringify(product))

            res.render('catalog-item', data);
        })
        .catch(next);
});