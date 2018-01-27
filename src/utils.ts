
import config from './config';
const moment = require('moment-timezone');

export { moment }

export function canonical(url: string) {
    return `${config.schema}//${config.host}${url}`;
}
