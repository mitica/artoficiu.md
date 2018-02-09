
require('dotenv').config()

const fs = require('fs')
const path = require('path')
const createClient = require('contentful-management').createClient

console.log(`Start script: createContentTypes`)

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
        const tasks = getContentTypes()
            .map(contentType => space.createContentTypeWithId(contentType.id, contentType.data)
                .then(ct => ct.publish()));

        return Promise.all(tasks)
    })
    .then(_ => console.log('DONE!'))
    .catch(error => console.error(error))

function getContentTypes() {
    const dir = path.join('scripts', 'contentTypes');
    return fs.readdirSync(dir).map(file => JSON.parse(fs.readFileSync(path.join(dir, file))))
}
