
import config from './config';
import { Request } from 'express';
const moment = require('moment-timezone');
const isProd = process.env.NODE_ENV === 'production';

export { moment }

export function canonical(url: string) {
    return `${config.schema}//${config.host}${url}`;
}

export function selfCanonical(url: string) {
    if (isProd) {
        return canonical(url);
    }
    return `http://localhost:${process.env.PORT}${url}`;
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

export function remoteIp(req: Request) {
    const ip = req.ip;
    if (ip === '::1') {
        return '127.0.0.1';
    }
    return ip;
}