
const vogels = require('vogels');
import { OrderSchema } from './schemas';

const tablePrefix = process.env.ARTOFICIU_TABLE_PREFIX;
if (typeof tablePrefix !== 'string') {
    throw new Error('ARTOFICIU_TABLE_PREFIX is required!');
}

export const NAMES = ['Order'];

export const OrderModel = vogels.define('Artoficiu_Order', {
    tableName: [tablePrefix, 'Artoficiu_Orders'].join('_'),
    hashKey: 'year',
    rangeKey: 'id',
    timestamps: false,
    schema: OrderSchema
})

export function getModel(name: string) {
    switch (name) {
        case 'Order': return OrderModel;
    }
    throw new Error('Invalid model name ' + name);
}
