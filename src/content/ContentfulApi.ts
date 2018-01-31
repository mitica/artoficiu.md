
const debug = require('debug')('artoficiu-content');
import { createClient, ContentfulClientApi } from 'contentful'

export interface ApiOptions {
    space: string
    accessToken: string
}

export interface EntityFields {
    [index: string]: any
}

export interface ContentfulEntity {
    sys?: any
    id: string
    createdAt: string
    updatedAt: string
    fields: EntityFields
}

export interface ApiQuery {
    limit: number
    content_type: string
    select?: string
    [index: string]: string | number | boolean
    locale?: string
}

export interface ContentfulEntityCollection<T extends ContentfulEntity> {
    total: number;
    skip: number;
    limit: number;
    items: Array<T>;
}

export class ContentfulApi {
    private client: ContentfulClientApi
    constructor(protected options: ApiOptions) {
        if (!options) {
            throw new Error(`options are required!`);
        }
        if (!options.space) {
            throw new Error(`options.space is required!`);
        }
        if (!options.accessToken) {
            throw new Error(`options.accessToken is required!`);
        }
        this.client = createClient({ ...this.options, ...{} });
    }

    protected getEntries(query: ApiQuery): Promise<ContentfulEntityCollection<ContentfulEntity>> {
        return this.client.getEntries(query)
            .then(data => {
                debug(`for getEntries ${query} got: `, JSON.stringify(data));
                return (this.client as any).parseEntries(data) as ContentfulEntityCollection<ContentfulEntity>;
            });
    }
}
