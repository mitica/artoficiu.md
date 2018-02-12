
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const cheerio = require('cheerio')
const crypto = require('crypto');


exports.DEFAULT_LANGUAGE = 'ru';

exports.md5 = function (str) {
    return crypto.createHash('md5').update(str, 'utf8').digest('hex', 'hex');
}

exports.createCategoryId = function (id) {
    return 'category' + id;
}

exports.createPropertyId = function (id) {
    return 'property' + id;
}

exports.saveData = function (name, data) {
    return fs.writeFileSync(path.join('scripts', 'import', 'data', name + '.json'), JSON.stringify(data), 'utf8');
}

exports.syncPromise = function (list, fn) {
    return list.reduce((prev, current) => prev.then(_ => fn(current)), Promise.resolve())
}

exports.loadHtmlPage = function (url, headers) {
    return fetch(url, { headers: headers })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Invalid status code: ${response.status}`);
            }
            return response.text();
        })
        .then(html => cheerio.load(html))
}

exports.uploadFile = function (space, file) {
    return space.createAssetWithId(exports.md5(file.fields.file.ru.upload), file)
        .then(asset => asset.processForAllLocales())
        .then(processedAsset => processedAsset.publish())
        .then(publishedAsset => publishedAsset.sys.id)
}

exports.uploadImageUrl = function (space, url, title) {
    const ext = url.substr(url.lastIndexOf('.'))
    const fileName = path.basename(url)
    title = title || path.basename(url, ext)
    let contentType;
    switch (ext.toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
    }
    return exports.uploadFile(space, {
        fields: {
            title: {
                ru: title
            },
            file: {
                ru: {
                    contentType: contentType,
                    fileName: fileName,
                    upload: url
                }
            }
        }
    })
}

exports.delay = function (ms, result) {
    return new Promise(resolve => setTimeout(() => resolve(result), ms))
}
