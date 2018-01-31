
export enum ContentTypes {
    SHOP_CATEGORY = 'shop_category',
    SHOP_PRODUCT = 'shop_product',
    SHOP_PRODUCT_PROPERTY = 'shop_product_property',
    SHOP_PRODUCT_VARIANT = 'shop_product_variant',
    FILE = 'file',
    ARTICLE = 'article',
    PAGE = 'page',
    WEB_APP_SETTINGS = 'web_app_settings',
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
    icon?: ImageEntity
}

export interface PageEntity extends Entity {
    title?: string
    shortTitle?: string
    slug?: string
    text?: string
    summary?: string
    image?: ImageEntity
}

export interface ArticleEntity extends Entity {
    title?: string
    shortTitle?: string
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
    price?: number
    oldPrice?: number
    isInStock?: boolean
    icon?: ImageEntity
}

export interface ShopProductPropertyEntity extends Entity {
    title?: string
    value?: string
    icon?: ImageEntity
}

export interface ShopProductEntity extends Entity {
    title?: string
    slug?: string
    price?: number
    oldPrice?: number
    isInStock?: boolean
    images?: ImageEntity[]
    variants?: ShopProductVariantEntity[]
    description?: string
    properties?: ShopProductPropertyEntity[]
    categories?: ShopCategoryEntity[]
}

export interface SliderItemEntity extends Entity {
    title?: string
    image?: ImageEntity
    link?: string
}

export interface SliderEntity extends Entity {
    title?: string
    items?: SliderItemEntity[]
}

export interface WebAppSettingsEntity extends Entity {
    title?: string
    desktopHomepageSlider?: SliderEntity
    mobileHomepageSlider?: SliderEntity
}

export interface EntityCollection<T extends Entity> {
    items: T[]
    total: number
}

export interface PageCollection extends EntityCollection<PageEntity> { }
export interface ArticleCollection extends EntityCollection<ArticleEntity> { }
export interface ShopCategoryCollection extends EntityCollection<ShopCategoryEntity> { }
export interface ShopProductCollection extends EntityCollection<ShopProductEntity> { }
