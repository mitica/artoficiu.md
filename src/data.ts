import { ContentApi } from "./content/ContentApi";
import { IOrdersRepository, DynamoOrdersRepository, createDbTables } from './orders';
import logger from "./logger";
import { CachePageStorage } from "./catalog/narbutas/cachePageStorage";

createDbTables().catch(error => logger.error(error));

export const NarbutasStorage = new CachePageStorage();

export const OrdersRepository: IOrdersRepository = new DynamoOrdersRepository();

export const ContentData = new ContentApi({
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export class DataContainer {
    private container: { [key: string]: Promise<any> } = {}

    getData() {
        const keys = Object.keys(this.container);
        const values = keys.map(key => this.container[key]);

        return Promise.all(values)
            .then(result => keys.reduce<{ [key: string]: any }>((data, key, index) => {
                data[key] = result[index];
                return data;
            }, {}));
    }

    push(key: string, promise: Promise<any>) {
        if (this.container[key]) {
            throw new Error(`key ${key} already exists`);
        }
        this.container[key] = promise;

        return this;
    }
}