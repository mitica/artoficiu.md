import { getPage } from "./utils";
const slug = require('slug');
import { seriesPromise } from "../../utils";
import { PageType, PageData } from "../../storage/narbutas/page";
import { PageStorage } from "../../storage/narbutas/pageStorage";
// const TurndownService = require('turndown')
// const turndownService = new TurndownService()

const storage = new PageStorage();

generate()
    .then(() => console.log('END'))
    .catch(e => console.error(e));

async function generate(): Promise<any> {
    const host = 'http://www.narbutas.ru';
    const rootMenu = await getPageMenu(host, host, 1);

    rootMenu.forEach(item => {
        item.id = slug(item.name.toLowerCase());
    });

    console.log('root menu', rootMenu)

    await generatePages(rootMenu, null, PageType.CATEGORY);

    await seriesPromise(rootMenu, async item => {
        console.log('getting menu 2')
        const menu2 = await getPageMenu(host, item.url, 2);
        console.log('menu2', menu2)
        await generatePages(menu2, item.id, PageType.CATEGORY, true);

        await seriesPromise(menu2, async item2 => {
            console.log('getting menu 3')
            const menu3 = await getPageMenu(host, item2.url, 3);
            console.log('menu3', menu3)
            await generatePages(menu3, item2.id, PageType.PAGE, true);
        });
    });
}

async function generatePages(items: MenuLink[], parentId: string, type: PageType, explore?: boolean): Promise<any> {
    parentId = parentId || null;

    let pages: PageData[] = [];

    if (explore) {
        await seriesPromise(items, async item => {
            const $ = await getPage(item.url);

            // const content = turndownService.turndown($('#content').html());
            const content = $('#content').html();

            pages.push({
                id: item.id, name: item.name, type,
                htmlContent: content,
            });
        })
    } else {
        pages = items.map<PageData>(item => ({ id: item.id, name: item.name, type }));
    }

    await seriesPromise(pages, page => storage.savePage(page));
}

async function getPageMenu(host: string, url: string, level: number): Promise<MenuLink[]> {
    console.log('exploring page', url)
    const page = await getPage(url);

    const items: MenuLink[] = [];
    page(`#mid_left .sme${level} > a`).each((_index, element) => {
        const item: MenuLink = {
            url: host + element.attribs['href'],
            id: element.attribs['href'].replace(/\//g, '').toLowerCase(),
            name: element.attribs['title'],
        };

        items.push(item);
    });

    console.log('explored page', url, items.length)

    return items;
}

type MenuLink = {
    id: string
    url: string
    name: string
}
