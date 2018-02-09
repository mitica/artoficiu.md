
import { Customer } from "./customer";
import { CartData } from "../cart/cartData";

export interface Order {
    id: number
    year: number
    customer: Customer
    total: number
    comments?: string
    countItems: number
    quantity: number

    items: OrderItem[]
    status: OrderStatus
    createdAt?: Date
    updatedAt?: Date
}

export enum OrderStatus {
    PENDING = 'pending',
    CLOSED = 'closed',
    CANCELED = 'canceled',
}

export type OrderItem = {
    product: OrderItemProduct
    quantity: number
    variant?: OrderItemProductVariant
}

export type OrderItemProduct = {
    id: string
    slug: string
    price: number
    title: string
    imageUrl?: string
}

export type OrderItemProductVariant = {
    id: string
    title: string
}

export function createOrderFromCartData(cart: CartData, customer: Customer, comments?: string): Order {
    const id = newOrderId();
    const order: Order = {
        id: id,
        year: yearFromOrderId(id),
        status: OrderStatus.PENDING,
        customer: customer,
        comments: comments,
        total: cart.price,
        countItems: cart.items.length,
        quantity: cart.quantity,
        createdAt: new Date(),
        items: null,
    }

    order.items = cart.items.map(item => {
        const orderItem: OrderItem = {
            product: {
                id: item.product.id,
                slug: item.product.slug,
                price: item.product.price,
                title: item.product.title,
                imageUrl: item.product.images && item.product.images.length && item.product.images[0].url,
            },
            quantity: item.quantity,
            variant: item.variant && {
                id: item.variant.id,
                title: item.variant.title,
            }
        }

        return orderItem;
    });

    return order;
}

export function newOrderId() {
    return Math.round(Date.now() / 100);
}

export function yearFromOrderId(id: number) {
    return new Date(id * 100).getUTCFullYear();
}
