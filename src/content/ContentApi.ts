// const debug = require('debug')('artoficiu-content');
import { CacheContentfulApi } from "./CacheContentfulApi";
import { ApiQuery } from "./ContentfulApi";
import {
  ShopCategoryEntity,
  ShopCategoryCollection,
  ShopProductCollection,
  ShopProductEntity,
  ArticleCollection,
  ArticleEntity,
  PageCollection,
  PageEntity,
  ContentTypes,
  WebAppSettingsEntity
} from "./entities";

import {
  toShopProducts,
  toArticles,
  toPages,
  toShopCategories,
  toSlider
} from "./entityMappers";

const ms = require("ms");

export interface BaseFilterParams {
  language: string;
}

export interface ListFilterParams extends BaseFilterParams {
  limit: number;
  skip?: number;
}

export interface ShopCategoryFilterParams extends ListFilterParams {
  isPromoted?: boolean;
}

export interface ShopProductFilterParams extends ListFilterParams {
  order: "createdAt" | "price" | "-createdAt" | "-price";
  categoryId?: string;
}

export interface EntityFilterParams extends BaseFilterParams {
  slug?: string;
  id?: string;
}

export interface IContentApi {
  shopCategory(params: EntityFilterParams): Promise<ShopCategoryEntity>;
  shopCategories(
    params: ShopCategoryFilterParams
  ): Promise<ShopCategoryCollection>;

  articles(params: ListFilterParams): Promise<ArticleCollection>;
  article(params: EntityFilterParams): Promise<ArticleEntity>;

  pages(params: ListFilterParams): Promise<PageCollection>;
  page(params: EntityFilterParams): Promise<PageEntity>;

  shopProducts(params: ShopProductFilterParams): Promise<ShopProductCollection>;
  shopProduct(params: EntityFilterParams): Promise<ShopProductEntity>;

  appSettings(params: BaseFilterParams): Promise<WebAppSettingsEntity>;
}

export class ContentApi extends CacheContentfulApi implements IContentApi {
  constructor(options: { space: string; accessToken: string }) {
    super(options, CACHE_OPTIONS);
  }

  shopCategory(params: EntityFilterParams): Promise<ShopCategoryEntity> {
    const query: ApiQuery = {
      locale: formatLocale(params),
      content_type: ContentTypes.SHOP_CATEGORY,
      include: 1,
      limit: 1
    };

    if (params.slug) {
      query["fields.slug"] = params.slug;
    } else {
      query["sys.id"] = params.id;
    }

    return this.getShopCategories(query).then(
      (collection) => (collection.items.length && collection.items[0]) || null
    );
  }

  shopCategories(
    params: ShopCategoryFilterParams
  ): Promise<ShopCategoryCollection> {
    const query: ApiQuery = {
      locale: formatLocale(params),
      content_type: ContentTypes.SHOP_CATEGORY,
      include: 1,
      limit: params.limit,
      order: "fields.order"
    };

    if (typeof params.isPromoted === "boolean") {
      query["fields.isPromoted"] = params.isPromoted;
    }

    return this.getShopCategories(query);
  }

  shopProduct(params: EntityFilterParams): Promise<ShopProductEntity> {
    const query: ApiQuery = {
      locale: formatLocale(params),
      content_type: ContentTypes.SHOP_PRODUCT,
      include: 4,
      limit: 1
    };

    if (params.slug) {
      query["fields.slug"] = params.slug;
    } else {
      query["sys.id"] = params.id;
    }

    return this.getShopProducts(query).then(
      (collection) => (collection.items.length && collection.items[0]) || null
    );
  }

  shopProducts(
    params: ShopProductFilterParams
  ): Promise<ShopProductCollection> {
    if (!params) {
      return Promise.reject(new Error(`parameter filter is invalid`));
    }

    const query: ApiQuery = {
      locale: formatLocale(params),
      limit: params.limit,
      content_type: ContentTypes.SHOP_PRODUCT,
      include: 1
    };

    if (params.skip) {
      query.skip = params.skip;
    }

    query.select =
      "sys,fields.name,fields.title,fields.slug,fields.price,fields.images,fields.oldPrice,fields.isInStock";

    switch (params.order) {
      case "createdAt":
        query.order = "sys.createdAt";
        break;
      case "-createdAt":
        query.order = "-sys.createdAt";
        break;
      case "price":
        query.order = "fields.price";
        break;
      case "-price":
        query.order = "-fields.price";
        break;

      default:
        query.order = "-sys.createdAt";
        break;
    }

    if (params.categoryId) {
      query["fields.categories.sys.id"] = params.categoryId;
    }

    return this.getShopProducts(query);
  }

  article(params: EntityFilterParams): Promise<ArticleEntity> {
    const query: ApiQuery = {
      locale: formatLocale(params),
      content_type: ContentTypes.ARTICLE,
      include: 1,
      limit: 1
    };

    if (params.slug) {
      query["fields.slug"] = params.slug;
    } else {
      query["sys.id"] = params.id;
    }

    return this.getArticles(query).then(
      (articles) => (articles.items.length && articles.items[0]) || null
    );
  }

  articles(params: ListFilterParams): Promise<ArticleCollection> {
    if (!params) {
      return Promise.reject(new Error(`parameter filter is invalid`));
    }
    const query: ApiQuery = {
      locale: formatLocale(params),
      limit: params.limit,
      content_type: ContentTypes.ARTICLE,
      order: "-sys.createdAt"
    };

    if (params.skip) {
      query.skip = params.skip;
    }

    query.select =
      "sys,fields.title,fields.slug,fields.summary,fields.image,fields.createdAt";

    return this.getArticles(query);
  }

  page(params: EntityFilterParams): Promise<ArticleEntity> {
    const query: ApiQuery = {
      locale: formatLocale(params),
      content_type: ContentTypes.PAGE,
      include: 1,
      limit: 1
    };

    if (params.slug) {
      query["fields.slug"] = params.slug;
    } else {
      query["sys.id"] = params.id;
    }

    return this.getPages(query).then(
      (articles) => (articles.items.length && articles.items[0]) || null
    );
  }

  pages(params: ListFilterParams): Promise<PageCollection> {
    if (!params) {
      return Promise.reject(new Error(`parameter filter is invalid`));
    }
    const query: ApiQuery = {
      locale: formatLocale(params),
      limit: params.limit,
      content_type: ContentTypes.PAGE,
      order: "-sys.createdAt"
    };

    if (params.skip) {
      query.skip = params.skip;
    }

    query.select =
      "sys,fields.title,fields.slug,fields.summary,fields.image,fields.shortTitle";

    return this.getPages(query);
  }

  appSettings(params: BaseFilterParams): Promise<WebAppSettingsEntity> {
    const query: ApiQuery = {
      content_type: ContentTypes.WEB_APP_SETTINGS,
      locale: formatLocale(params),
      order: "-sys.createdAt",
      limit: 1,
      include: 2
    };

    return this.getEntries(query).then((collection) => {
      if (!collection) {
        return null;
      }

      if (!collection.items || !collection.items.length) {
        return null;
      }

      const item = collection.items[0];

      return {
        id: item.sys.id,
        createdAt: item.sys.createdAt,
        homepageSlider: toSlider(item.fields.homepageSlider)
      };
    });
  }

  protected getPages(query: ApiQuery) {
    query.content_type = ContentTypes.PAGE;

    return this.getEntries(query).then(toPages);
  }

  protected getArticles(query: ApiQuery) {
    query.content_type = ContentTypes.ARTICLE;

    return this.getEntries(query).then(toArticles);
  }

  protected getShopCategories(query: ApiQuery) {
    query.content_type = ContentTypes.SHOP_CATEGORY;

    return this.getEntries(query).then(toShopCategories);
  }

  protected getShopProducts(query: ApiQuery) {
    query.content_type = ContentTypes.SHOP_PRODUCT;

    return this.getEntries(query).then(toShopProducts);
  }
}

function formatLocale(params: BaseFilterParams) {
  return params.language.toLowerCase();
}

const CACHE_OPTIONS: { [type: string]: any } = {};

CACHE_OPTIONS[ContentTypes.WEB_APP_SETTINGS] = {
  item: { max: 2, maxAge: ms("1h") },
  collection: { max: 2, maxAge: ms("1h") }
};

CACHE_OPTIONS[ContentTypes.ARTICLE] = {
  item: { max: 50, maxAge: ms("1h") },
  collection: { max: 50, maxAge: ms("10m") }
};

CACHE_OPTIONS[ContentTypes.PAGE] = {
  item: { max: 50, maxAge: ms("1h") },
  collection: { max: 50, maxAge: ms("10m") }
};

CACHE_OPTIONS[ContentTypes.SHOP_CATEGORY] = {
  item: { max: 50, maxAge: ms("1h") },
  collection: { max: 50, maxAge: ms("10m") }
};

CACHE_OPTIONS[ContentTypes.SHOP_PRODUCT] = {
  item: { max: 100, maxAge: ms("130m") },
  collection: { max: 50, maxAge: ms("10m") }
};
