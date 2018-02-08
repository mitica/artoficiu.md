import { Order } from "./order";


export interface IOrdersRepository {
    delete(id: number): Promise<boolean>
    getById(id: number): Promise<Order>
    exists(id: number): Promise<boolean>
    create(data: Order): Promise<Order>
    update(data: Order): Promise<Order>
    ordersByYear(data: { year: number; limit: number; }): Promise<Order[]>
}
