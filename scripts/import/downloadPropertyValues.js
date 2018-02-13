
const fs = require('fs')
const helpers = require('./helpers')

module.exports = function downloadItems(space, headers) {

    const items = [];

    const tasks = getIds().map(id => getItem(id, headers)
        .then(item => {
            if (item) {
                items.push(item)
            }
        })
        .catch(error => console.log(error.message))
    )

    return Promise.all(tasks).then(() => {
        if (items.length === 0) {
            throw new Error(`No property value explored!`)
        }
        return helpers.saveData('property_values', items)
    });
}

function getItem(id, headers) {
    return helpers.loadHtmlPage(`http://www.artoficiu.md/Admin/ECommerce/EditPropertyValue/${id}`, headers)
        .then($ => parseItem($, id))
}

function parseItem($, id) {
    const propertyId = parseInt($('#PropertyId').val())
    const name = $('#Name').val()
    const ro = $('#Translations_0__Name').val()
    const ru = $('#Translations_1__Name').val()

    if (!name || !propertyId) {
        throw new Error(`Invalid property value page`)
    }

    return {
        id: `shop_property_value${id}`,
        contentType: 'shop_property_value',
        fields: {
            name: getPropertyName(propertyId),
            value: {
                ru: ru || ro || name,
                ro: ro || name || ru,
            },
        }
    }
}

function getPropertyName(id) {
    return require('./data/properties.json').find(item => item.id === 'property' + id).fields.name
}


function getIds() {
    const ids = [];
    for (var i = 1; i <= 100; i++) {
        ids.push(i);
    }
    return ids;
}
