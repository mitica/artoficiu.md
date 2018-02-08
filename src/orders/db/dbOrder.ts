import { Customer } from "../customer";
import { Order, OrderStatus, yearFromOrderId } from "../order";

export const DB_ORDER_LIST_FIELDS = ['id', 'year', 'customer', 'total', 'countItems', 'quentity', 'status', 'createdAt']

export type DbOrderId = {
    id: number
    year: number
}

export interface DbOrder {
    id: number
    year: number
    customer: Customer
    total: number
    comments?: string
    countItems: number
    quantity: number

    items: string
    status: string
    createdAt?: Date
    updatedAt?: Date
}

export function convertOrderToDbOrder(order: Order): DbOrder {
    const dbOrder: DbOrder = {
        id: order.id,
        year: order.year,
        comments: order.comments,
        countItems: order.countItems,
        createdAt: order.createdAt,
        customer: clearObject(order.customer),
        items: JSON.stringify(order.items),
        quantity: order.quantity,
        status: order.status,
        total: order.total,
    }

    return clearObject(dbOrder);
}

export function convertDbOrderToOrder(dbOrder: DbOrder): Order {
    const order: Order = {
        id: dbOrder.id,
        year: dbOrder.year,
        comments: dbOrder.comments,
        countItems: dbOrder.countItems,
        createdAt: new Date(dbOrder.createdAt),
        customer: dbOrder.customer,
        items: dbOrder.items && JSON.parse(dbOrder.items),
        quantity: dbOrder.quantity,
        status: dbOrder.status as OrderStatus,
        total: dbOrder.total,
        updatedAt: dbOrder.updatedAt && new Date(dbOrder.updatedAt)
    }

    return order;
}

export function createDbOrderId(id: number): DbOrderId {
    return {
        id: id,
        year: yearFromOrderId(id)
    }
}

function clearObject<T>(obj: any): T {
    for (var prop in obj) {
        if (~[null, '', undefined].indexOf(obj[prop])) {
            delete obj[prop];
        }
    }
    return obj as T;
}