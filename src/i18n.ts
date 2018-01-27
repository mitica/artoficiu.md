
import * as i18n from 'i18n';
import { join } from 'path';
import config from './config';

i18n.configure({
    locales: config.languages,
    directory: join(__dirname, '../locales'),
    fallbacks: {
        'ru_MD': 'ru'
    },
    defaultLocale: config.languages[0],
});

export default i18n.init as any