
const fs = require('fs')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const helpers = require('./helpers');

module.exports = function importCategories(space, headers) {

    const categories = {};

    const tasks = getIds().map(id => getCategory(id, headers)
        .then(category => {
            categories[category.id] = category;
        })
        .catch(error => console.log(error.message))
    )

    return Promise.all(tasks).then(() => {
        if (Object.keys(categories) === 0) {
            throw new Error(`No category explored!`)
        }
        return helpers.saveData('categories', categories)
    });
}

function getCategory(id, headers) {
    return fetch(`http://www.artoficiu.md/Admin/ECommerce/EditCategory/${id}`, { headers: headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Invalid status code: ${response.status}`);
            }
            return response.text();
        })
        .then(html => cheerio.load(html))
        .then($ => parseCategory($, id))
}

function parseCategory($, id) {
    const order = parseInt($('#Order').val())
    const slug = $('#Translations_0__UrlSlug').val()

    if (!slug) {
        throw new Error(`Invalid category page`)
    }

    const ro = {
        title: $('#Translations_0__H1').val(),
        shortTitle: $('#Translations_0__Name').val(),
        description: $('#Translations_0__MetaDescription').val(),
    }
    const ru = {
        shortTitle: $('#Translations_1__Name').val(),
        title: $('#Translations_1__H1').val(),
        description: $('#Translations_1__MetaDescription').val(),
    }

    return {
        id: helpers.createCategoryId(id),
        contentType: 'shop_category',
        fields: {
            order: { ru: order },
            slug: { ru: slug },
            title: {
                ru: ru.title,
                ro: ro.title,
            },
            shortTitle: {
                ru: ru.shortTitle,
                ro: ro.shortTitle,
            },
            description: {
                ru: ru.description,
                ro: ro.description,
            },
        }
    }
}

function getIds() {
    const ids = [];
    for (var i = 1; i < 30; i++) {
        ids.push(i);
    }
    return ids;
}
