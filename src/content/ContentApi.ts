
import { CacheContentfulApi } from './CacheContentfulApi';
import { ContentfulEntity, ContentfulEntityCollection, ApiQuery } from './ContentfulApi';
const ms = require('ms');

export enum ContentTypes {
    SHOP_CATEGORY = 'shop_category',
    SHOP_PRODUCT = 'shop_product',
    FILE = 'file',
    ARTICLE = 'article',
    PAGE = 'page',
}

export interface Entity {
    id: string
    createdAt?: string
    updatedAt?: string
    [index: string]: any
}

export interface ShopCategoryEntity extends Entity {
    title?: string
    slug?: string
    parent?: ShopCategoryEntity
    order?: number
}

export interface PageEntity extends Entity {
    title?: string
    slug?: string
    text?: string
    summary?: string
    image?: ImageEntity
}

export interface ArticleEntity extends Entity {
    title?: string
    slug?: string
    text?: string
    summary?: string
    image?: ImageEntity
}

export interface ImageEntity extends Entity {
    title?: string
    url?: string
    width?: number
    height?: number
    size?: number
    contentType?: string
}

export interface ShopProductVariantEntity extends Entity {
    title?: string
    slug?: string
    price?: number
    oldPrice?: number
    inStock?: number
    icon?: ImageEntity
}

export interface ShopProductSpecificationEntity extends Entity {
    title?: string
    slug?: string
    valueTitle?: string
    value?: string
}

export interface ShopProductEntity extends Entity {
    title?: string
    slug?: string
    price?: number
    oldPrice?: number
    inStock?: number
    coverImage?: ImageEntity
    images?: ImageEntity[]
    variants?: ShopProductVariantEntity[]
    description?: string
    specifications?: ShopProductSpecificationEntity[]
    categories?: ShopCategoryEntity[]
}

export interface EntityCollection<T extends Entity> {
    items: T[]
    total: number
}

export interface PageCollection extends EntityCollection<PageEntity> { }
export interface ArticleCollection extends EntityCollection<ArticleEntity> { }
export interface ShopCategoryCollection extends EntityCollection<ShopCategoryEntity> { }
export interface ShopProductCollection extends EntityCollection<ShopProductEntity> { }

export interface BaseFilterParams {
    language: string
}

export interface ListFilterParams extends BaseFilterParams {
    limit: number
}

export interface FilterShopProductsParams extends ListFilterParams {
    order: 'createdAt' | 'price' | '-createdAt' | '-price'
    category?: string
}

export interface FilterEntityParams extends BaseFilterParams {
    slug?: string
    id?: string
}

export interface IContentApi {
    shopCategory(params: FilterEntityParams): Promise<ShopCategoryEntity>
    shopCategories(params: ListFilterParams): Promise<ShopCategoryCollection>

    articles(filter: ListFilterParams): Promise<ArticleCollection>
    article(params: FilterEntityParams): Promise<ArticleEntity>

    pages(filter: ListFilterParams): Promise<PageCollection>
    page(params: FilterEntityParams): Promise<PageEntity>

    shopProducts(filter: FilterShopProductsParams): Promise<ShopProductCollection>
    shopProduct(params: FilterEntityParams): Promise<ShopProductEntity>
}


export class ContentApi extends CacheContentfulApi implements IContentApi {
    constructor(options: { space: string, accessToken: string }) {
        super(options, CACHE_OPTIONS)
    }

    shopCategory(params: FilterEntityParams): Promise<ShopCategoryEntity> {
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

    shopCategories(params: ListFilterParams): Promise<ShopCategoryCollection> {
        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.SHOP_CATEGORY,
            include: 1,
            limit: 100,
            order: 'fields.order',
        };

        return this.getShopCategories(query);
    }

    shopProduct(params: FilterEntityParams): Promise<ShopProductEntity> {

        const query: ApiQuery = {
            locale: formatLocale(params),
            content_type: ContentTypes.SHOP_PRODUCT,
            include: 1,
            limit: 1,
        };

        if (params.slug) {
            query['fields.slug'] = params.slug;
        } else {
            query['sys.id'] = params.id;
        }

        return this.getShopProducts(query)
            .then(articles => articles.items.length && articles.items[0] || null);
    }

    shopProducts(params: FilterShopProductsParams): Promise<ShopProductCollection> {
        if (!params) {
            return Promise.reject(new Error(`parameter filter is invalid`));
        }
        const query: ApiQuery = {
            locale: formatLocale(params),
            limit: params.limit,
            content_type: ContentTypes.SHOP_PRODUCT,
        };
        // query.select = 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.summary,fields.image,fields.category';

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

        if (params.category) {
            query['categories.fields.slug'] = params.category;
        }

        return this.getShopProducts(query);
    }

    article(params: FilterEntityParams): Promise<ArticleEntity> {

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
        // query.select = 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.summary,fields.image,fields.category';

        return this.getArticles(query);
    }

    page(params: FilterEntityParams): Promise<ArticleEntity> {

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
        // query.select = 'sys.id,sys.createdAt,sys.updatedAt,fields.title,fields.slug,fields.summary,fields.image,fields.category';

        return this.getPages(query);
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

function toShopProduct(entity: ContentfulEntity): ShopCategoryEntity {
    if (!entity) {
        return null;
    }
    const data: ShopCategoryEntity = {
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        title: entity.fields.title,
        slug: entity.fields.slug,
        summary: entity.fields.summary,
    }

    if (entity.fields.text) {
        data.text = entity.fields.text;
    }

    if (entity.fields.image) {
        data.image = toImage(entity.fields.image);
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
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        title: entity.fields.title,
        slug: entity.fields.slug,
        summary: entity.fields.summary,
    }

    if (entity.fields.text) {
        data.text = entity.fields.text;
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
        id: entity.id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        title: entity.fields.title,
        slug: entity.fields.slug,
        summary: entity.fields.summary,
    }

    if (entity.fields.text) {
        data.text = entity.fields.text;
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
        id: entity.id
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
