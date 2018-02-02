import { ShopProductEntity, ShopProductVariantEntity } from "../content/entities";

export function createEmptyCartData(): CartData {
    return {
        items: [],
        count: 0,
        totalPrice: 0,
    }
}

export type CartData = {
    items: CartItemData[]
    count: number
    totalPrice: number
}


export type CartItemData = {
    id: string
    item: ShopProductEntity
    count: number
    variant?: ShopProductVariantEntity
    totalPrice: number
}
