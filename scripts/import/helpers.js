
const fs = require('fs')
const path = require('path')

exports.DEFAULT_LANGUAGE = 'ru';

exports.createCategoryId = function (id) {
    return 'category' + id;
}

exports.saveData = function (name, data) {
    return fs.writeFileSync(path.join('scripts', 'import', 'data', name + '.json'), JSON.stringify(data), 'utf8');
}

exports.syncPromise = function (list, fn) {
    return list.reduce((prev, current) => prev.then(_ => fn(current)), Promise.resolve())
}