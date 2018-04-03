
import * as cheerio from 'cheerio';

import fetch from 'node-fetch';

export function getPage(url: string): Promise<CheerioStatic> {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                return Promise.reject(new Error(`Error on accessing url: ${url}`));
            }
            return response.text();
        })
        .then(html => cheerio.load(html));
}
