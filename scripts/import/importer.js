
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
        return importImages(space)
            .then(_ => helpers.syncPromise(getData(), items => createEntities(space, items)))
    })
    .then(_ => console.log('DONE!'))
    .catch(error => console.error(error))

function createEntities(space, items) {
    return helpers.syncPromise(items,
        item => space.createEntryWithId(item.contentType, item.id, { fields: item.fields })
            .then(ce => ce.publish())
            .then(_ => console.log(`created entry ${item.contentType}, ${item.id}`)));
}

function importImages(space) {
    const dir = path.join('scripts', 'import', 'data');
    const images = JSON.parse(fs.readFileSync(path.join(dir, 'images.json')))

    return helpers.syncPromise(images, url => helpers.uploadImageUrl(space, url)
        .catch(error => console.error(error)))
}

function getData() {
    const dir = path.join('scripts', 'import', 'data');
    const filesNames = ['property_values'];

    return filesNames.map(name => JSON.parse(fs.readFileSync(path.join(dir, name + '.json'))))
}
