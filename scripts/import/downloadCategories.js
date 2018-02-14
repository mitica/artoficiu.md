
const fs = require('fs')
const helpers = require('./helpers')

module.exports = function downloadCategories(space, headers) {

    const categories = [];

    return helpers.syncPromise(getIds(), id => getCategory(id, headers)
        .then(category => {
            if (category) {
                categories.push(category)
            }
        })
        .catch(error => console.log(error.message))
    ).then(() => {
        if (categories.length === 0) {
            throw new Error(`No category explored!`)
        }
        return helpers.saveData('categories', categories)
    });
}

function getCategory(id, headers) {
    return helpers.loadHtmlPage(`http://www.artoficiu.md/Admin/ECommerce/EditCategory/${id}`, headers)
        .then($ => parseCategory($, id))
}

function parseCategory($, id) {
    const order = parseInt($('#Order').val())
    let slug = $('#Translations_0__UrlSlug').val()

    if (!slug) {
        throw new Error(`Invalid category page`)
    }
    slug = helpers.toSlug(slug)

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
            order: { ro: order },
            slug: { ro: slug },
            title: {
                ru: ru.title,
                ro: ro.title,
            },
            name: {
                ru: ru.shortTitle,
                ro: ro.shortTitle,
            },
            metaDescription: {
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
