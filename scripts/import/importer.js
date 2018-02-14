
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const createClient = require('contentful-management').createClient
const helpers = require('./helpers');

console.log(`Start script: importer`)

const spaceId = process.env.CONTENTFUL_SPACE

if (!spaceId) {
    throw `env CONTENTFUL_SPACE is required!`
}

const accessToken = process.env.CONTENTFUL_PERSONAL_ACCESS_TOKEN

if (!accessToken) {
    throw `env CONTENTFUL_PERSONAL_ACCESS_TOKEN is required!`
}

const client = createClient({
    accessToken: accessToken
})

client.getSpace(spaceId)
    .then(space => {
        if (process.env.IMAGES) {
            return importImages(space)
        }
        return helpers.syncPromise(getData(), items => createEntities(space, items))
    })
    .then(_ => console.log('DONE!'))
    .catch(error => console.error(error))

function createEntities(space, items) {
    if (items.length) {
        console.log(`=================================`)
        console.log(`start importing entities ${items[0].contentType}`)
    }
    return helpers.syncPromise(items,
        item => space.createEntryWithId(item.contentType, item.id, { fields: item.fields })
            .then(ce => helpers.delay(1000).then(_ => ce))
            .then(ce => ce.publish())
            .then(_ => helpers.delay(2000))
            .then(_ => console.log(`created entry ${item.contentType}, ${item.id}`)));
}

function importImages(space) {
    console.log('start importing images')
    const dir = path.join('scripts', 'import', 'data');
    const images = JSON.parse(fs.readFileSync(path.join(dir, 'images.json')))

    return helpers.syncPromise(images,
        url => helpers.uploadImageUrl(space, url)
            .then(_ => helpers.delay(2000))
            .then(_ => console.log(`imported image ${url}`))
            .catch(error => console.error(error)))
}

function getData() {
    const dir = path.join('scripts', 'import', 'data');
    const filesNames = process.env.CT && process.env.CT.split(/[,;\s]+/g) || ['categories', 'property_values', 'product_variants', 'products'];

    return filesNames.map(name => JSON.parse(fs.readFileSync(path.join(dir, name + '.json'))))
}
