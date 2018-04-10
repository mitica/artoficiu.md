import { getPage } from "./utils";
const slug = require('slug');
import { seriesPromise } from "../../utils";
import { PageType, PageData, PageImage } from "../../catalog/narbutas/page";
import { PageStorage } from "../../catalog/narbutas/pageStorage";
// const TurndownService = require('turndown')
// const turndownService = new TurndownService()

const storage = new PageStorage();
const HOST = 'http://www.narbutas.ru';

generate()
    .then(() => console.log('END'))
    .catch(e => console.error(e));

async function generate(): Promise<any> {

    const rootMenu = await getPageMenu(HOST, 1);

    const pages1 = await generatePages(rootMenu, null, PageType.CATEGORY);
    let index1 = 0;
    await seriesPromise(rootMenu, async item => {
        console.log('getting menu 2')
        const menu2 = await getPageMenu(item.url, 2);
        const pages2 = await generatePages(menu2, item.id, PageType.CATEGORY, true);
        let index2 = 0;
        await seriesPromise(menu2, async item2 => {
            console.log('getting menu 3')
            const menu3 = await getPageMenu(item2.url, 3);
            const pages3 = await generatePages(menu3, item2.id, PageType.PAGE, true);

            pages2[index2].image = pages1[index1].image = pages3[0].image;

            await savePages(pages3);

            index2++;
        });

        await savePages(pages2);

        index1++;
    });

    await savePages(pages1);
}

async function generatePages(items: MenuLink[], parentId: string, type: PageType, explore?: boolean): Promise<PageData[]> {
    parentId = parentId || null;

    let pages: PageData[] = [];

    if (explore) {
        await seriesPromise(items, async item => {
            const $ = await getPage(item.url);

            // const content = turndownService.turndown($('#content').html());
            $('#content .product_link').remove();
            $('#content .product_links_title').remove();
            $('#content h1').remove();
            $('#content strong:empty').remove();
            $('#content p:empty').remove();
            $('#content div:empty').remove();
            $('#content p:empty').remove();
            $('#content a').each((_i, el) => {
                const $el = $(el);
                $el.attr('target', '_blank');
                $el.removeAttr('onclick');
                $el.removeAttr('style');
                let href = $el.attr('href');
                if (href && !href.startsWith('http')) {
                    console.log('add http://narbutas.ru to link ' + href);
                    href = 'http://narbutas.ru' + (href[0] === '/' ? href : '/' + href);
                }
                $el.attr('href', href);
                $el.attr('rel', 'nofollow noindex');
            });
            $('#content p,#content div').each((_i, el) => {
                const $el = $(el);
                $el.removeAttr('style');
                if ($el.find('img,a').length === 0) {
                    if ($el.text().trim().length === 0 || $el.text().trim() === '&nbsp;') {
                        console.log('remove empty element');
                        $el.remove();
                    }
                }
            });

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
                        largeUrl: formatUrl(element.attribs['href'].replace(/_resampled\/croppedimage\d+-/i, '')),
                        mediumUrl: formatUrl(element.attribs['href']),
                        smallUrl: formatUrl(img.attr('src'))
                    })
                })

                page.images = images;

                page.image = images[0];
            }

            pages.push(page);
        })
    } else {
        pages = items.map<PageData>(item => ({ id: item.id, name: item.name, type, parentId }));
    }

    return pages;
}

async function savePages(pages: PageData[]): Promise<any> {
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
