import { readdir } from "fs";
import { basename } from "path";
import { getPagesDir } from "./page";
import { PageStorage } from "./pageStorage";

export class Menu {
    private static items: Map<string, MenuItem> = new Map()
    private static itemsByParentId: Map<string, MenuItem[]> = new Map()
    private static loaded = false;

    static getItem(id: string): MenuItem {
        return Menu.items.get(id);
    }

    static getItems(parentId: string): MenuItem[] {
        parentId = parentId || null;
        return this.itemsByParentId.get(parentId);
    }

    static boot(): Promise<void> {
        if (Menu.loaded) {
            return Promise.resolve();
        }

        const storage = new PageStorage();

        return new Promise((resolve, reject) => {
            readdir(getPagesDir(), ((error, files) => {
                if (error) {
                    return reject(error);
                }
                const ids = files.map(file => basename(file, '.json'));
                const pages = ids.map(id => storage.getPage(id));
                Promise.all(pages).then(pagesData => {
                    pagesData.forEach(pd => {
                        const item = { id: pd.id, name: pd.name };
                        Menu.items.set(pd.id, item);
                        const parentId = pd.parentId || null;
                        const list = Menu.itemsByParentId.get(parentId) || [];
                        list.push(item);
                        Menu.itemsByParentId.set(parentId, list);
                    });
                    Menu.loaded = true;
                    resolve();
                });
            }))
        });
    }
}

export type MenuItem = {
    id: string
    name: string
}
