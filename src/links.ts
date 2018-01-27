
const urlset = require('urlset');
import { join } from 'path';
import config from './config';

export default urlset(join(__dirname, '../sitemap.json'), {
    params: { language: { format: 's', value: config.languages[0] } }
});
