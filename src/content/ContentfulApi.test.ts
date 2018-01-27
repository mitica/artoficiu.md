
import test from 'ava';
import { ContentfulApi } from './ContentfulApi';

test('constructor', t => {
    t.throws(() => new ContentfulApi(null), () => true, 'null options');
    t.throws(() => new ContentfulApi({ accessToken: 'a', space: null }), () => true, 'null options.space');
    t.throws(() => new ContentfulApi({ accessToken: null, space: 'a' }), () => true, 'null options.accessToken');
    t.notThrows(() => new ContentfulApi({ accessToken: 'a', space: 'a' }));
});
