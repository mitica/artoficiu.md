
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
    let id = '';
    let media = ''
    const result = /(images|videos)\.ctfassets\.net\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+\/([a-zA-Z0-9]+)\//.exec(href);
    if (result) {
        // const urlParts = Url.parse(href, false);
        // href = `${urlParts.pathname}?w=650&q=90`;
        media = result[1];
        id = result[2];
    } else {
        return renderImage(id, href, title, text);
    }

    if (media === 'videos') {
        return renderVideo(id, href, title, text);
    }


    return renderImage(id, href, title, text);
}

function renderImage(id: string, href: string, title: string, text: string) {
    id = 'image-' + id;
    title = encodeURIComponent(title || text);
    text = encodeURIComponent(text);
    return `<p><a class="article_pic_a js-article-image" name="${id}" href="#${id}" data-id="${id}"><img class="article_pic" alt="${text}" src="${href}" /></a></p>`
}

function renderVideo(id: string, href: string, title: string, text: string) {
    id = 'video-' + id;
    title = encodeURIComponent(title || text);
    text = encodeURIComponent(text);
    return `<p><video class="article_video" controls><source src="${href}" /></video></p>`
}
