
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
            throw new Error(`No variant explored!`)
        }
        return helpers.saveData('product_variants', items)
    });
}

function getItem(id, headers) {
    return helpers.loadHtmlPage(`http://www.artoficiu.md/Admin/ECommerce/EditProductItem/${id}`, headers)
        .then($ => parseItem($, id))
}

function parseItem($, id, headers) {
    const productId = $('input#ProductId').val()
    if (!productId) {
        return Promise.reject(new Error(`Invalid variant page`))
    }
    const quantity = parseInt($('#Quantity').val())

    if (quantity < 1) {
        console.log(`Variant 0 quantity`)
        // return Promise.resolve()
    }

    const enabled = $('#Enabled').prop('checked');

    if (!enabled) {
        console.log(`Variant not enabled`)
        return Promise.resolve()
    }

    const properties = $('.portlet-body select option[selected]')
        .toArray()
        .map(item => $(item).val())

    if (!properties.length) {
        console.log('Variant without props');
        return Promise.resolve()
    }

    const variant = {
        id: `shop_product_variant${id}`,
        contentType: 'shop_product_variant',
        fields: {
            isInStock: { ru: quantity > 0 },
            name: createVariantName(properties),
            properties: {
                ru: properties.map(item => {
                    return { "sys": { "type": "Link", "linkType": "Entry", "id": `property_value${item}` } }
                }),
            }
        }
    }

    return variant
}

function createVariantName(properties) {
    const property_values = require('./data/property_values')
    const values = property_values.filter(item => properties.findIndex(p => ('property_value' + p) === item.id) > -1)
    const ro = values.map(val => val.fields.value.ro).join('/')
    const ru = values.map(val => val.fields.value.ru).join('/')

    return {
        ro: ro,
        ru: ru
    }
}

function getIds() {
    const ids = [];
    for (var i = 1; i < 120; i++) {
        ids.push(i);
    }
    return ids;
}
