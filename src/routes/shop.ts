import { Router, Request, Response, NextFunction } from "express";
import { DataContainer, ContentData } from "../data";
import links from "../links";
import { canonical } from "../utils";
import { ShopProductEntity } from "../content/entities";

const route: Router = Router();

export default route;

//shop

route.get("/shop", function (req: Request, res: Response, next: NextFunction) {
  const culture = res.locals.culture;
  const __ = res.locals.__;
  let page = parseInt(req.query.page as string);
  page = page > 0 ? page : 0;

  res.locals.site.head.title = __("shop_page_title");
  res.locals.site.head.description = __("shop_page_description");
  res.locals.site.head.keywords = __("shop_page_keywords");

  const defaultOrder = "-createdAt";
  let order = defaultOrder as "price" | "-createdAt";
  let sortParam = null;
  if (~["price"].indexOf(req.query.sort as string)) {
    order = "price";
    sortParam = "price";
  }

  res.locals.sortParam = sortParam;
  res.locals.pageParam = page > 0 ? page : null;

  res.locals.currentPageLink =
    page > 0
      ? links.shop({ page: page, sort: sortParam })
      : links.shop({ sort: sortParam });
  res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

  const dc: DataContainer = res.locals.dataContainer;

  dc.push(
    "shopProducts",
    ContentData.shopProducts({
      limit: 20,
      skip: page * 20,
      language: culture.language,
      order
    })
  );

  dc.getData()
    .then((data) => {
      res.render("shop", data);
    })
    .catch(next);
});

//shop/:category

route.get(
  "/shop/:category",
  function (req: Request, res: Response, next: NextFunction) {
    const categorySlug = req.params.category;
    const culture = res.locals.culture;
    const __ = res.locals.__;
    let page = parseInt(req.query.page as string);
    page = page > 0 ? page : 0;

    const defaultOrder = "-createdAt";
    let order = defaultOrder as "price" | "-createdAt";
    let sortParam: string = null;
    if (~["price"].indexOf(req.query.sort as string)) {
      order = "price";
      sortParam = "price";
    }

    res.locals.sortParam = sortParam;
    res.locals.pageParam = page > 0 ? page : null;

    const dc: DataContainer = res.locals.dataContainer;

    dc.push(
      "selectedShopCategory",
      ContentData.shopCategory({
        language: culture.language,
        slug: categorySlug
      })
    );

    dc.getData()
      .then((data) => {
        if (!data.selectedShopCategory) {
          const error: any = new Error(`Not found category ${categorySlug}`);
          error.statusCode = 404;
          return next(error);
        }

        const slug = data.selectedShopCategory.slug;

        res.locals.currentPageLink =
          page > 0
            ? links.shop.category(slug, { page: page, sort: sortParam })
            : links.shop.category(slug, { sort: sortParam });
        res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

        res.locals.site.head.title =
          data.selectedShopCategory.metaTitle ||
          __("shop") +
            " / " +
            (data.selectedShopCategory.title || data.selectedShopCategory.name);
        res.locals.site.description = data.selectedShopCategory.metaDescription;
        return ContentData.shopProducts({
          limit: 20,
          skip: page * 20,
          language: culture.language,
          order,
          categoryId: data.selectedShopCategory.id
        }).then((shopProducts) => {
          data.shopProducts = shopProducts;
          res.render("shop", data);
        });
      })
      .catch(next);
  }
);

//shop/item

route.get(
  "/shop/item/:slug",
  function (req: Request, res: Response, next: NextFunction) {
    const slug = req.params.slug;
    const culture = res.locals.culture;
    // const __ = res.locals.__;

    res.locals.currentPageLink = links.shop.item(slug);
    res.locals.site.head.canonical = canonical(res.locals.currentPageLink);

    const dc: DataContainer = res.locals.dataContainer;

    dc.push(
      "product",
      ContentData.shopProduct({ language: culture.language, slug: slug })
    );

    dc.getData()
      .then((data) => {
        const product: ShopProductEntity = data.product;
        if (!product) {
          const error: any = new Error(`Not found product ${slug}`);
          error.statusCode = 404;
          return next(error);
        }

        if (product.metaTitle || product.title) {
          res.locals.site.head.title = product.metaTitle || product.title;
        } else if (product.categories && product.categories.length) {
          res.locals.site.head.title =
            product.name + " - " + product.categories[0].title;
        } else {
          res.locals.site.head.title = product.name;
        }

        res.locals.site.head.description = product.metaDescription;

        res.render("shop-item", data);
      })
      .catch(next);
  }
);
