
import { OrderModel } from './db/models';
import { Order } from './order';
import { convertDbOrderToOrder, DbOrder, convertOrderToDbOrder, DB_ORDER_LIST_FIELDS, createDbOrderId } from './db/dbOrder';
import { IOrdersRepository } from './ordersRepository';

export class DynamoOrdersRepository implements IOrdersRepository {

    delete(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            OrderModel.destroy(createDbOrderId(id), (error: Error) => {
                if (error) {
                    return reject(error);
                }
                resolve(true);
            });
        });
    }

    getById(id: number): Promise<Order> {
        return new Promise((resolve, reject) => {
            OrderModel.get(createDbOrderId(id), {}, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(result && convertDbOrderToOrder(result.get()));
            });
        });
    }

    exists(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            OrderModel.get(createDbOrderId(id), { AttributesToGet: ['id'] }, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }

                resolve(!!result);
            });
        });
    }

    create(data: Order): Promise<Order> {

        return new Promise((resolve, reject) => {
            const params: { [index: string]: any } = {};
            params.overwrite = false;

            const dbOrder: DbOrder = convertOrderToDbOrder(data);

            OrderModel.create(dbOrder, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(result && convertDbOrderToOrder(result.get()));
            });
        });
    }

    update(data: Order): Promise<Order> {

        return new Promise((resolve, reject) => {
            const params: { [index: string]: any } = {};
            params.expected = createDbOrderId(data.id);

            const dbOrder: DbOrder = convertOrderToDbOrder(data);

            OrderModel.update(dbOrder, params, (error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(result && convertDbOrderToOrder(result.get()));
            });
        });
    }

    ordersByYear(data: { year: number; limit: number; }): Promise<Order[]> {

        return new Promise((resolve, reject) => {

            let query = OrderModel
                .query(data.year)
                .limit(data.limit)
                .attributes(DB_ORDER_LIST_FIELDS)
                .descending();


            query.exec((error: Error, result: any) => {
                if (error) {
                    return reject(error);
                }
                resolve(result && result.Items && result.Items.map((item: any) => convertDbOrderToOrder(item.get())) || []);
            });
        });
    }
}
