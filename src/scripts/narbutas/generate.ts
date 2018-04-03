import { getPage } from "./utils";
const slug = require('slug');
import { seriesPromise } from "../../utils";
import { PageType, PageData, PageImage } from "../../storage/narbutas/page";
import { PageStorage } from "../../storage/narbutas/pageStorage";
// const TurndownService = require('turndown')
// const turndownService = new TurndownService()

const storage = new PageStorage();
const HOST = 'http://www.narbutas.ru';

generate()
    .then(() => console.log('END'))
    .catch(e => console.error(e));

async function generate(): Promise<any> {

    const rootMenu = await getPageMenu(HOST, 1);

    await generatePages(rootMenu, null, PageType.CATEGORY);

    await seriesPromise(rootMenu, async item => {
        console.log('getting menu 2')
        const menu2 = await getPageMenu(item.url, 2);
        await generatePages(menu2, item.id, PageType.CATEGORY, true);

        await seriesPromise(menu2, async item2 => {
            console.log('getting menu 3')
            const menu3 = await getPageMenu(item2.url, 3);
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
            let content = $('#content').html();

            if (content) {
                content = content.replace(/"assets\//g, '"' + HOST + '/assets/');
                content = content.replace(/"\/assets\//g, '"' + HOST + '/assets/');
            }

            const page: PageData = {
                id: item.id, name: item.name, type,
                htmlContent: content,
                parentId,
            };

            if (type === PageType.PAGE) {
                const images: PageImage[] = []
                $('.ad-thumb-list a').each((_index, element) => {
                    const img = $('img', element);
                    images.push({
                        largeUrl: formatUrl(element.attribs['href']),
                        smallUrl: formatUrl(img.attr('src'))
                    })
                })

                page.images = images;
            }

            pages.push(page);
        })
    } else {
        pages = items.map<PageData>(item => ({ id: item.id, name: item.name, type, parentId }));
    }

    await seriesPromise(pages, page => storage.savePage(page));
}

async function getPageMenu(url: string, level: number): Promise<MenuLink[]> {
    console.log('exploring page', url)
    const page = await getPage(url);

    const items: MenuLink[] = [];
    page(`#mid_left .sme${level} > a`).each((_index, element) => {
        const item: MenuLink = {
            url: HOST + element.attribs['href'],
            id: slug(element.attribs['title'].trim().toLowerCase()),
            name: element.attribs['title'],
        };

        items.push(item);
    });

    return items;
}

function formatUrl(url: string) {
    return HOST + ('/' + url).replace(/\/\//g, '/', );
}

type MenuLink = {
    id: string
    url: string
    name: string
}
