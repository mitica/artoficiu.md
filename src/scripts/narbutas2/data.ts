import fetch from 'node-fetch';

export async function loadData() {
    const categories = await loadCategories();
    await loadProducts(categories);

    return categories;
}

async function loadCategories() {
    const response = await fetch('http://www.narbutas.ru/wp-json/data/v1/get_product_category', { timeout: 3000 });
    const json = await response.json();

    const categories = json.info as Category[];

    return categories;
}

async function loadProducts(categories: Category[]) {
    for (const category of categories) {
        if (category.products) {
            for (const product of category.products) {
                console.log(`Exploring product ${product.slug}...`);
                const response = await fetch('http://www.narbutas.ru/wp-json/data/v1/getsingleinfo/' + product.slug, { timeout: 3000 });
                const json = await response.json();
                const details: ProductDetails = {
                    images: [],
                    texts: [],
                };
                product.details = details;
                for (const block of json.info.blocks) {
                    if (block.acf_fc_layout === 'SliderBlock') {
                        if (!block.info.slider) {
                            console.log(`Invalid block`, block.info);
                            continue;
                        }
                        block.info.slider.forEach((slide: any) => details.images.push({
                            large: slide.src,
                            small: slide.src,
                        }));
                    } else if (block.acf_fc_layout === 'TexturesBlock') {
                        details.texts.push({
                            title: block.info.title,
                            body: block.info.text,
                        })
                    } else if (block.acf_fc_layout === 'TextBlock') {
                        details.texts.push({
                            title: block.info.title,
                            body: block.info.text,
                        })
                    } else if (block.acf_fc_layout === 'ImgTexthorizontalFullWith') {
                        details.texts.push({
                            title: block.info.title,
                            body: `<a href="${block.info.img}" class="fancybox" alt=""><img src="${block.info.img}" /></a>` + block.info.text,
                        })
                    }
                }
            }
        }
        if (category.childs) {
            await loadProducts(category.childs);
        }
    }
}

//http://www.narbutas.ru/wp-json/data/v1/getsingleinfo/nova-tumbocki
export type Category = {
    name: string
    slug: string
    description?: string
    link: string
    childs?: Category[]
    products?: Product[]
}

export type Product = {
    cat0: string
    cat1: string

    id: number
    slug: string
    title: string
    subtitle?: string
    img: string
    link: string

    details: ProductDetails
}

export type ProductDetails = {
    images: { small: string, large: string }[]
    texts: { title: string, body: string }[]
}
