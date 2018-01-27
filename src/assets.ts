
const css: { [name: string]: string } = require('../public/static/css/rev-manifest.json');
const js: { [name: string]: string } = require('../public/static/js/rev-manifest.json');

const assets = { ...css, ...js };

export default {
    getName(name: string) {
        return assets[name];
    }
}
