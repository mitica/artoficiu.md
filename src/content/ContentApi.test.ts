
require('dotenv').config();

import { ContentApi } from './ContentApi';
import test from 'ava';

const api = new ContentApi({
    space: process.env.CONTENTFUL_SPACE,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

test('shopCategory', async t => {
    const shopCategory = await api.shopCategory({ id: '1IjH8VopI42qWcYQeukQOG_', language: 'ro' });

    t.is(null, shopCategory);
});

test('shopCategories', async t => {
    let categories = await api.shopCategories({ language: 'ro', limit: 10 });
    console.log(categories.items)
    t.is(true, categories.items.length > 0, 'many shop categories');

    //for cache test
    categories = await api.shopCategories({ language: 'ro', limit: 10 });
    t.is(true, categories.items.length > 0, 'many shop categories');
});

test('article', async t => {
    const entity = await api.article({ id: '3g80f7DeaQyAuSU8Q2EYAM_', language: 'ro' });
    t.is(null, entity);
});
