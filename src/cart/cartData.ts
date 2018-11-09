import { ShopProductEntity, ShopProductVariantEntity } from "../content/entities";

export function createEmptyCartData(): CartData {
    return {
        items: [],
        quantity: 0,
        total: 0,
    }
}

export type CartData = {
    items: CartItemData[]
    quantity: number
    total: number
}


export type CartItemData = {
    id: string
    product: ShopProductEntity
    quantity: number
    variant?: ShopProductVariantEntity
    variantId?: string
    price: number
    total: number
}
