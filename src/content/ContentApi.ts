
const debug = require('debug')('artoficiu-content');
import { CacheContentfulApi } from './CacheContentfulApi';
import { ContentfulEntity, ContentfulEntityCollection, ApiQuery } from './ContentfulApi';
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
    ImageEntity,
    WebAppSettingsEntity,
    SliderEntity,
    SliderItemEntity,
    ShopProductPropertyEntity,
    ShopProductVariantEntity
} from './entities';

const ms = require('ms');


export interface BaseFilterParams {
    language: string
}

export interface ListFilterParams extends BaseFilterParams {
    limit: number
}

export interface ShopCategoryFilterParams extends ListFilterParams {
    isPromoted?: boolean
}

export interface ShopProductFilterParams extends ListFilterParams {
    order: 'createdAt' | 'price' | '-createdAt' | '-price'
    categoryId?: string
}

export interface EntityFilterParams extends BaseFilterParams {
    slug?: string
    id?: string
}

export interface IContentApi {
    shopCategory(params: EntityFilterParams): Promise<ShopCategoryEntity>
    shopCategories(params: ShopCategoryFilterParams): Promise<ShopCategoryCollection>

    articles(params: ListFilterParams): Promise<ArticleCollection>
    article(params: EntityFilterParams): Promise<ArticleEntity>

    pages(params: ListFilterParams): Promise<PageCollection>
    page(params: EntityFilterParams): Promise<PageEntity>

    shopProducts(params: ShopProductFilterParams): Promise<ShopProductCollection>
    shopProduct(params: EntityFilterParams): Promise<ShopProductEntity>

    appSettings(params: BaseFilterParams): Promise<WebAppSettingsEntity>
}


export class ContentApi extends CacheContentfulApi implements IContentApi {
    constructor(options: { space: string, accessToken: string }) {
        super(options, CACHE_OPTIONS)
    }

    shopCategory(params: EntityFilterParams): Promise<ShopCategoryEntity> {
        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.SHOP_CATEGORY,
            include: 1,
            limit: 1,
        };
        if (params.slug) {
            query['fields.slug'] = params.slug;
        } else {
            query['sys.id'] = params.id;
        }

        return this.getShopCategories(query)
            .then(collection => collection.items.length && collection.items[0] || null);
    }

    shopCategories(params: ShopCategoryFilterParams): Promise<ShopCategoryCollection> {
        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.SHOP_CATEGORY,
            include: 1,
            limit: 100,
            order: 'fields.order',
        };

        if (typeof params.isPromoted === 'boolean') {
            query['fields.isPromoted'] = params.isPromoted;
        }

        return this.getShopCategories(query);
    }

    shopProduct(params: EntityFilterParams): Promise<ShopProductEntity> {

        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.SHOP_PRODUCT,
            include: 2,
            limit: 1,
        };

        if (params.slug) {
            query['fields.slug'] = params.slug;
        } else {
            query['sys.id'] = params.id;
        }

        return this.getShopProducts(query)
            .then(collection => collection.items.length && collection.items[0] || null);
    }

    shopProducts(params: ShopProductFilterParams): Promise<ShopProductCollection> {
        if (!params) {
            return Promise.reject(new Error(`parameter filter is invalid`));
        }

        const query: ApiQuery = {
            locale: formatLocale(params),
            limit: params.limit,
            content_type: ContentTypes.SHOP_PRODUCT,
            include: 1,
        }

        query.select = 'sys,fields.title,fields.slug,fields.price,fields.images,fields.oldPrice,fields.isInStock';

        switch (params.order) {
            case 'createdAt':
                query.order = 'sys.createdAt';
                break;
            case '-createdAt':
                query.order = '-sys.createdAt';
                break;
            case 'price':
                query.order = 'sys.price';
                break;
            case '-price':
                query.order = '-sys.price';
                break;

            default:
                query.order = '-sys.createdAt';
                break;
        }

        if (params.categoryId) {
            query['fields.categories.sys.id'] = params.categoryId;
        }

        return this.getShopProducts(query);
    }

    article(params: EntityFilterParams): Promise<ArticleEntity> {

        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.ARTICLE,
            include: 1,
            limit: 1,
        };

        if (params.slug) {
            query['fields.slug'] = params.slug;
        } else {
            query['sys.id'] = params.id;
        }

        return this.getArticles(query)
            .then(articles => articles.items.length && articles.items[0] || null);
    }

    articles(params: ListFilterParams): Promise<ArticleCollection> {
        if (!params) {
            return Promise.reject(new Error(`parameter filter is invalid`));
        }
        const query: ApiQuery = {
            locale: formatLocale(params),
            limit: params.limit,
            content_type: ContentTypes.ARTICLE,
            order: '-sys.createdAt'
        };
        query.select = 'sys,fields.title,fields.slug,fields.summary,fields.image';

        return this.getArticles(query);
    }

    page(params: EntityFilterParams): Promise<ArticleEntity> {

        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.PAGE,
            include: 1,
            limit: 1,
        };

        if (params.slug) {
            query['fields.slug'] = params.slug;
        } else {
            query['sys.id'] = params.id;
        }

        return this.getPages(query)
            .then(articles => articles.items.length && articles.items[0] || null);
    }

    pages(params: ListFilterParams): Promise<PageCollection> {
        if (!params) {
            return Promise.reject(new Error(`parameter filter is invalid`));
        }
        const query: ApiQuery = {
            locale: formatLocale(params),
            limit: params.limit,
            content_type: ContentTypes.PAGE,
            order: '-sys.createdAt'
        };
        query.select = 'sys,fields.title,fields.slug,fields.summary,fields.image,fields.shortTitle';

        return this.getPages(query);
    }

    appSettings(params: BaseFilterParams): Promise<WebAppSettingsEntity> {
        const query: ApiQuery = {
            content_type: ContentTypes.WEB_APP_SETTINGS,
            locale: formatLocale(params),
            order: '-sys.createdAt',
            limit: 1,
            include: 2,
        };

        return this.getEntries(query).then(collection => {
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
                desktopHomepageSlider: convertSlider(item.fields.desktopHomepageSlider),
                mobileHomepageSlider: convertSlider(item.fields.mobileHomepageSlider),
            }
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
    return `${params.language.toLowerCase()}-${params.language.toUpperCase()}`;
}

const CACHE_OPTIONS: { [type: string]: any } = {};

CACHE_OPTIONS[ContentTypes.WEB_APP_SETTINGS] = {
    item: { max: 2, maxAge: ms('1h') },
    collection: { max: 2, maxAge: ms('1h') },
};

CACHE_OPTIONS[ContentTypes.ARTICLE] = {
    item: { max: 50, maxAge: ms('1h') },
    collection: { max: 50, maxAge: ms('30m') },
};

CACHE_OPTIONS[ContentTypes.PAGE] = {
    item: { max: 50, maxAge: ms('1h') },
    collection: { max: 50, maxAge: ms('30m') },
};

CACHE_OPTIONS[ContentTypes.SHOP_CATEGORY] = {
    item: { max: 50, maxAge: ms('1h') },
    collection: { max: 50, maxAge: ms('30m') },
};

CACHE_OPTIONS[ContentTypes.SHOP_PRODUCT] = {
    item: { max: 100, maxAge: ms('130m') },
    collection: { max: 50, maxAge: ms('10m') },
};

function convertSliderItem(item: ContentfulEntity): SliderItemEntity {
    if (!item) {
        return null;
    }
    const slider: SliderItemEntity = {
        id: item.sys.id,
        title: item.fields.title,
        link: item.fields.link,
        image: toImage(item.fields.image),
    }

    return slider;
}

function convertSlider(item: ContentfulEntity): SliderEntity {
    if (!item) {
        return null;
    }
    const slider: SliderEntity = {
        id: item.sys.id,
        items: item.fields.items && item.fields.items.map(convertSliderItem) || [],
    }

    return slider;
}

function toShopProducts(collection: ContentfulEntityCollection<ContentfulEntity>): ShopProductCollection {
    const data: ShopProductCollection = { total: 0, items: [] };
    if (!collection) {
        return data;
    }

    if (!collection.items) {
        data.total = collection.total || data.total;
        return data;
    }

    data.items = collection.items.map(toShopProduct);

    return data;
}

function toShopProduct(entity: ContentfulEntity): ShopProductEntity {
    if (!entity) {
        return null;
    }
    const data: ShopProductEntity = {
        id: entity.sys.id,
        createdAt: entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        title: entity.fields.title,
        slug: entity.fields.slug,
        description: entity.fields.description,
        price: entity.fields.price,
        oldPrice: entity.fields.oldPrice,
        isInStock: entity.fields.isInStock,
    }

    if (entity.fields.images) {
        data.images = entity.fields.images.map(toImage);
    }

    if (entity.fields.categories) {
        data.categories = entity.fields.categories.map(toShopCategory);
    }

    if (entity.fields.properties) {
        data.properties = entity.fields.properties.map(toShopProductProperty);
    }

    if (entity.fields.variants) {
        data.variants = entity.fields.variants.map(toShopProductVariant);
    }

    return data;
}

function toShopProductVariant(entity: ContentfulEntity): ShopProductVariantEntity {
    if (!entity) {
        return null;
    }
    const data: ShopProductVariantEntity = {
        id: entity.sys.id,
        createdAt: entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        title: entity.fields.title,
        isInStock: entity.fields.isInStock,
        price: entity.fields.price,
        oldPrice: entity.fields.oldPrice,
        colorCode: entity.fields.colorCode,
        icon: entity.fields.icon && toImage(entity.fields.icon),
    }

    return data;
}

function toShopProductProperty(entity: ContentfulEntity): ShopProductPropertyEntity {
    if (!entity) {
        return null;
    }
    const data: ShopProductPropertyEntity = {
        id: entity.sys.id,
        createdAt: entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        title: entity.fields.title,
        value: entity.fields.value,
        icon: entity.fields.icon && toImage(entity.fields.icon),
    }

    return data;
}

function toArticles(collection: ContentfulEntityCollection<ContentfulEntity>): ArticleCollection {
    const data: ArticleCollection = { total: 0, items: [] };
    if (!collection) {
        return data;
    }

    if (!collection.items) {
        data.total = collection.total || data.total;
        return data;
    }

    data.items = collection.items.map(toArticle);

    return data;
}

function toArticle(entity: ContentfulEntity): ArticleEntity {
    if (!entity) {
        return null;
    }
    const data: ArticleEntity = {
        id: entity.sys.id,
        createdAt: entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        title: entity.fields.title,
        shortTitle: entity.fields.shortTitle,
        slug: entity.fields.slug,
        summary: entity.fields.summary,
    }

    if (entity.fields.text) {
        data.text = entity.fields.text;
    } else {
        debug(`article no field: text!`);
    }

    if (entity.fields.image) {
        data.image = toImage(entity.fields.image);
    }

    return data;
}

function toPages(collection: ContentfulEntityCollection<ContentfulEntity>): PageCollection {
    const data: PageCollection = { total: 0, items: [] };
    if (!collection) {
        return data;
    }

    if (!collection.items) {
        data.total = collection.total || data.total;
        return data;
    }

    data.items = collection.items.map(toPage);

    return data;
}

function toPage(entity: ContentfulEntity): PageEntity {
    if (!entity) {
        return null;
    }
    const data: PageEntity = {
        id: entity.sys.id,
        createdAt: entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        title: entity.fields.title,
        shortTitle: entity.fields.shortTitle,
        slug: entity.fields.slug,
        summary: entity.fields.summary,
    }

    if (entity.fields.text) {
        data.text = entity.fields.text;
    } else {
        debug(`page no field text`);
    }

    if (entity.fields.image) {
        data.image = toImage(entity.fields.image);
    }

    return data;
}


function toShopCategories(collection: ContentfulEntityCollection<ContentfulEntity>): ShopCategoryCollection {
    const data: ShopCategoryCollection = { total: 0, items: [] };
    if (!collection) {
        return data;
    }

    if (!collection.items) {
        data.total = collection.total || data.total;
        return data;
    }

    data.items = collection.items.map(toShopCategory);

    return data;
}

function toShopCategory(entity: ContentfulEntity): ShopCategoryEntity {
    if (!entity) {
        return null;
    }
    const data: ShopCategoryEntity = {
        id: entity.sys.id,
        // createdAt: entity.createdAt,
        // updatedAt: entity.updatedAt,
    }
    if (entity.fields) {
        data.title = entity.fields.title;
        data.shortTitle = entity.fields.shortTitle;
        data.slug = entity.fields.slug;

        if (entity.fields.parent) {
            data.parent = toShopCategory(entity.fields.parent);
        }
    }

    return data;
}

function toImage(entity: ContentfulEntity): ImageEntity {
    if (!entity) {
        return null;
    }
    const data: ImageEntity = {
        id: entity.sys.id
    }

    if (entity.fields) {
        if (entity.fields.file) {
            if (entity.fields.file.url) {
                data.url = entity.fields.file.url;
            }
            if (entity.fields.file.contentType) {
                data.contentType = entity.fields.file.contentType;
            }
            if (entity.fields.file.details) {
                data.size = entity.fields.file.details.size;
                if (entity.fields.file.details.image) {
                    data.width = entity.fields.file.details.image.width;
                    data.height = entity.fields.file.details.image.height;
                }
            }
        }
    }

    return data;
}
