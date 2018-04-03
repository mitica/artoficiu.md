import { PageStorage } from "./pageStorage";

import * as LRU from 'lru-cache';
import { PageData } from "./page";

const cache = LRU<string, PageData>({
    max: 30,
    maxAge: 1000 * 60 * 60,
});

export class CachePageStorage extends PageStorage {

    getPage(id: string): Promise<PageData> {
        if (cache.has(id)) {
            return Promise.resolve(cache.get(id));
        }

        return super.getPage(id).then(data => {
            if (data) {
                cache.set(data.id, data);
            }
            return data;
        });
    }

}
