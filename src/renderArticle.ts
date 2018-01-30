
// import * as Url from 'url'
import * as marked from 'marked';
// import config from './config';
// const atonic = require('atonic');
const renderer = new marked.Renderer();
// const defaultLink = renderer.link;
// const defaultImage = renderer.image;

export default function render(text: string) {
    // text = text.replace(/(<([^>]+)>)/ig, '');
    return marked(text, {
        renderer: renderer,
        // accept HTML
        sanitize: true
    });
}

renderer.image = function (href: string, title: string, text: string) {
    let imageId = '';
    const result = /images\.contentful\.com\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/([a-zA-Z0-9]+)\//.exec(href);
    if (result) {
        // const urlParts = Url.parse(href, false);
        // href = `${urlParts.pathname}?w=650&q=90`;
        imageId = 'image-' + result[1];
    }
    title = encodeURIComponent(title || text);
    text = encodeURIComponent(text);
    return `<p><a class="article_pic_a js-article-image" name="${imageId}" href="#${imageId}" data-id="${imageId}"><img class="article_pic" alt="${text}" src="${href}" /></a></p>`
}
