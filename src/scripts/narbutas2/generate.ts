
import { PageType, PageData, PageImage } from "../../catalog/narbutas/page";
import { PageStorage } from "../../catalog/narbutas/pageStorage";
import { Category, Product, loadData } from "./data";

const storage = new PageStorage();
// const HOST = 'http://www.narbutas.ru';

generate()
    .then(() => console.log('END'))
    .catch(e => console.error(e));

async function generate() {
    const categories = await loadData();

    await generateCategories(categories);
}

async function generateCategories(categories: Category[], parentId?: string) {
    for (const category of categories) {
        const catPage = categoryToPage(category, parentId);
        await storage.savePage(catPage);

        if (category.products) {
            for (const product of category.products) {
                const prodPage = productToPage(product, catPage.id);

                await storage.savePage(prodPage);
            }
        }

        if (category.childs) {
            await generateCategories(category.childs, catPage.id);
        }
    }
}

function productToPage(item: Product, parentId: string) {
    const image = item.img;

    const htmlContent = item.details.texts.map(text => `<h3>${text.title}</h3>${text.body}`).join('');

    const page: PageData = {
        type: PageType.PAGE,
        htmlContent,
        id: item.slug,
        name: item.title,
        parentId,
        image: {
            largeUrl: image,
            smallUrl: image,
            mediumUrl: image,
        },
        images: item.details.images.map<PageImage>(img => ({ largeUrl: img.large, smallUrl: img.small, mediumUrl: img.large, })),
    }

    return page;
}

function categoryToPage(item: Category, parentId?: string) {
    const image = getCategoryImage(item);

    const page: PageData = {
        type: PageType.CATEGORY,
        htmlContent: item.description,
        id: item.slug,
        name: item.name,
        parentId,
        image: {
            largeUrl: image,
            smallUrl: image,
            mediumUrl: image,
        },
    }

    return page;
}

function getCategoryImage(category: Category): string | undefined {
    if (category.products && category.products.length) {
        return category.products[0].img;
    }
    if (category.childs && category.childs.length) {
        return getCategoryImage(category.childs[0]);
    }
}