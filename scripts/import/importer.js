
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
        return helpers.syncPromise(getData(), item => createEntities(space, item))
    })
    .then(_ => console.log('DONE!'))
    .catch(error => console.error(error))

function createEntities(space, data) {
    return helpers.syncPromise(Object.keys(data),
        id => space.createEntryWithId(data[id].contentType, id, { fields: data[id].fields })
            .then(ce => ce.publish())
            .then(_ => console.log(`created entry ${data[id].contentType}, ${id}`)));
}

function getData() {
    const dir = path.join('scripts', 'import', 'data');
    const filesNames = ['categories'];

    return filesNames.map(name => JSON.parse(fs.readFileSync(path.join(dir, name + '.json'))))
}
