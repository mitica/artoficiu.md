
const debug = require('debug')('artoficiu-content');
import { ContentfulEntity, ContentfulEntityCollection } from './ContentfulApi';
import {
    ShopCategoryEntity,
    ShopCategoryCollection,
    ShopProductCollection,
    ShopProductEntity,
    ArticleCollection,
    ArticleEntity,
    PageCollection,
    PageEntity,
    ImageEntity,
    SliderEntity,
    SliderItemEntity,
    PropertyValueEntity,
    ShopProductVariantEntity
} from './entities';

export function toSliderItem(item: ContentfulEntity): SliderItemEntity {
    if (!item || !item.fields) {
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

export function toSlider(item: ContentfulEntity): SliderEntity {
    if (!item || !item.fields) {
        return null;
    }
    const slider: SliderEntity = {
        id: item.sys.id,
        items: item.fields.items && item.fields.items.map(toSliderItem) || [],
    }

    return slider;
}

export function toShopProducts(collection: ContentfulEntityCollection<ContentfulEntity>): ShopProductCollection {
    const data: ShopProductCollection = {
        items: [],
        total: collection.total,
        skip: collection.skip,
        limit: collection.limit
    }

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
    if (!entity || !entity.fields) {
        return null;
    }
    const data: ShopProductEntity = {
        id: entity.sys.id,
        createdAt: entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        name: entity.fields.name,
        slug: entity.fields.slug,
        title: entity.fields.title,
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
        data.properties = entity.fields.properties.map(toPropertyValue);
    }

    if (entity.fields.variants) {
        data.variants = entity.fields.variants.map(toShopProductVariant);
    }

    return data;
}

function toShopProductVariant(entity: ContentfulEntity): ShopProductVariantEntity {
    if (!entity || !entity.fields) {
        return null;
    }
    const data: ShopProductVariantEntity = {
        id: entity.sys.id,
        // createdAt: entity.sys.createdAt,
        // updatedAt: entity.sys.updatedAt,
        name: entity.fields.name,
        isInStock: entity.fields.isInStock,
        price: entity.fields.price,
        oldPrice: entity.fields.oldPrice,
        // icon: entity.fields.icon && toImage(entity.fields.icon),
        properties: entity.fields.properties && entity.fields.properties.map((item: any) => toPropertyValue(item))
    }

    return data;
}

export function toPropertyValue(entity: ContentfulEntity): PropertyValueEntity {
    if (!entity || !entity.fields) {
        return null;
    }
    const data: PropertyValueEntity = {
        id: entity.sys.id,
        // createdAt: entity.sys.createdAt,
        // updatedAt: entity.sys.updatedAt,
        name: entity.fields.name,
        value: entity.fields.value,
        colorCode: entity.fields.colorCode,
        icon: entity.fields.icon && toImage(entity.fields.icon),
    }

    return data;
}

export function toArticles(collection: ContentfulEntityCollection<ContentfulEntity>): ArticleCollection {
    const data: ArticleCollection = {
        items: [],
        total: collection.total,
        skip: collection.skip,
        limit: collection.limit
    }
    if (!collection) {
        return data;
    }

    if (!collection.items) {
        return data;
    }

    data.items = collection.items.map(toArticle);

    return data;
}

function toArticle(entity: ContentfulEntity): ArticleEntity {
    if (!entity || !entity.fields) {
        return null;
    }
    const data: ArticleEntity = {
        id: entity.sys.id,
        createdAt: entity.fields.createdAt || entity.sys.createdAt,
        updatedAt: entity.sys.updatedAt,
        title: entity.fields.title,
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

export function toPages(collection: ContentfulEntityCollection<ContentfulEntity>): PageCollection {
    const data: PageCollection = {
        items: [],
        total: collection.total,
        skip: collection.skip,
        limit: collection.limit
    }

    if (!collection) {
        return data;
    }

    if (!collection.items) {
        return data;
    }

    data.items = collection.items.map(toPage);

    return data;
}

export function toPage(entity: ContentfulEntity): PageEntity {
    if (!entity || !entity.fields) {
        return null;
    }
    const data: PageEntity = {
        id: entity.sys.id,
        // createdAt: entity.sys.createdAt,
        // updatedAt: entity.sys.updatedAt,
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


export function toShopCategories(collection: ContentfulEntityCollection<ContentfulEntity>): ShopCategoryCollection {
    const data: ShopCategoryCollection = {
        items: [],
        total: collection.total,
        skip: collection.skip,
        limit: collection.limit
    }

    if (!collection) {
        return data;
    }

    if (!collection.items) {
        return data;
    }

    data.items = collection.items.map(toShopCategory);

    return data;
}

export function toShopCategory(entity: ContentfulEntity): ShopCategoryEntity {
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
        data.name = entity.fields.name;
        data.slug = entity.fields.slug;
        data.metaTitle = entity.fields.metaTitle;
        data.metaDescription = entity.fields.metaDescription;

        if (entity.fields.parent) {
            data.parent = toShopCategory(entity.fields.parent);
        }
    }

    return data;
}

export function toImage(entity: ContentfulEntity): ImageEntity {
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
