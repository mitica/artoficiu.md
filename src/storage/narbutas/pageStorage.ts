import { PageData } from "./page";
import { formatPagePath } from "./page";
import { readFile, writeFile } from "fs";

export interface IPageStorage {
    getPage(id: string): Promise<PageData>
    savePage(page: PageData): Promise<PageData>
}

export class PageStorage implements IPageStorage {
    getPage(id: string): Promise<PageData> {
        return new Promise((resolve, reject) => {
            const file = formatPagePath(id);
            readFile(file, 'utf8', (error, content) => {
                if (error) {
                    return reject(error);
                }
                resolve(JSON.parse(content) as PageData);
            });
        });
    }

    savePage(page: PageData): Promise<PageData> {
        return new Promise((resolve, reject) => {
            const file = formatPagePath(page.id);
            writeFile(file, JSON.stringify(page), 'utf8', error => {
                if (error) {
                    return reject(error);
                }
                resolve(page);
            });
        });
    }
}
