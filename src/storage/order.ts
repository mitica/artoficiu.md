
import { Customer } from "./customer";
import { ShopProductEntity, ShopProductVariantEntity } from "../content/entities";


export interface Order {
    id: string
    customer: Customer
    total: number
    comments?: string
    countItems: number
    quantity: number

    items: OrderItem[]

    createdAt?: Date
}

export type OrderItem = {
    product: ShopProductEntity
    quantity: number
    variant?: ShopProductVariantEntity
}
