
import { Request, Response, NextFunction } from 'express';
import { ContentData } from '../data';


export default function (_req: Request, res: Response, next: NextFunction) {

    const culture = res.locals.culture;
    const dc = res.locals.dataContainer;
    
    dc.push('shopCategories', ContentData.shopCategories({ limit: 10, language: culture.language }));
    dc.push('latestArticles', ContentData.articles({ limit: 5, language: culture.language }));

    dc.push('promotedShopCategories',
        ContentData.shopCategories({ limit: 3, language: culture.language, isPromoted: true })
            .then(categories => {
                if (categories && categories.items && categories.items.length) {
                    const tasks: any[] = [];
                    categories.items.forEach(item => tasks.push(ContentData.shopProducts({ limit: 4, language: culture.language, categoryId: item.id, order: '-createdAt' })));

                    return Promise.all(tasks)
                        .then(results => results.forEach((collection, i) => categories.items[i].topProducts = collection))
                        .then(() => categories);
                }
                return categories;
            })
    );

    next();
};
