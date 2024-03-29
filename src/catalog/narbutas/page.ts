import { join } from "path";

const PAGES_DIR = join(__dirname, '..', '..', '..', 'storage', 'narbutas', 'pages')

export function getPagesDir() {
    return PAGES_DIR;
}

export function formatPagePath(id: string) {
    return join(getPagesDir(), id + '.json');
}

export type PageData = {
    id: string
    parentId?: string
    name?: string
    shortName?: string
    title?: string
    htmlContent?: string
    images?: PageImage[]
    type: PageType
    image?: PageImage
}

export type PageImage = {
    smallUrl?: string
    mediumUrl?: string
    largeUrl?: string
}

export enum PageType {
    CATEGORY = 'CATEGORY',
    PAGE = 'PAGE',
}
