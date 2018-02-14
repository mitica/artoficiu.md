
const fs = require('fs')
const helpers = require('./helpers')

module.exports = function downloadItems(space, headers) {

    const items = [];

    return helpers.syncPromise(getIds(), id => getItem(id, headers)
        .then(item => {
            if (item) {
                items.push(item)
            }
        })
        .catch(error => console.log(error.message))
    )
        .then(() => {
            if (items.length === 0) {
                return console.error(`No property explored!`)
            }
            return helpers.saveData('properties', items)
        });
}

function getItem(id, headers) {
    return helpers.loadHtmlPage(`http://www.artoficiu.md/Admin/ECommerce/EditProperty/${id}`, headers)
        .then($ => parseItem($, id))
}

function parseItem($, id) {
    const ro = $('#Translations_0__Name').val()

    if (!ro) {
        throw new Error(`Invalid property page`)
    }
    const ru = $('#Translations_1__Name').val()

    return {
        id: `property${id}`,
        contentType: 'property',
        fields: {
            name: {
                ru: ru,
                ro: ro,
            },
        }
    }
}


function getIds() {
    const ids = [];
    for (var i = 1; i <= 5; i++) {
        ids.push(i);
    }
    return ids;
}
