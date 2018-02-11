
const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')
const cheerio = require('cheerio')

exports.DEFAULT_LANGUAGE = 'ru';

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
