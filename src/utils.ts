
import config from './config';
const moment = require('moment-timezone');

export { moment }

export function canonical(url: string) {
    return `${config.schema}//${config.host}${url}`;
}

export function formatNumber(n: number, lang: string, maximumFractionDigits: number = 2): string {
    const result = n.toLocaleString(lang, { maximumFractionDigits });
    switch (lang) {
        case 'ro': return result.replace('.', ',').replace(',', '.');
        case 'ru': return result.replace(',', ' ').replace('.', ',');
    }

    return result;
}

export function imageIconUrl(url: string, size?: number) {
    size = 60;
    return `${url}?w=${size}&h=${size}`;
}
