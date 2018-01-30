require('dotenv').config();

import * as express from 'express';
import config from './config';
import logger from './logger';
import * as path from 'path';
const bodyParser = require('body-parser');
import links from './links';
import initi18n from './i18n';
import catchError from './catch';
import rootMiddleware from './middlewares/root';
import homeRoute from './routes/home';
import redirectRoute from './routes/redirect';
import articlesRoute from './routes/articles';
import assets from './assets';
import { Response } from 'express';

const ms = require('ms');

const cookieParser = require('cookie-parser');

// const cors = require('cors');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.disable('x-powered-by');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));
app.disable('etag');

app.locals.NODE_ENV = process.env.NODE_ENV;
app.locals.links = links;
app.locals.config = config;
app.locals.assets = assets;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
app.use(cookieParser());
// app.use(methodOverride());
// app.use(responseTime());

app.use(express.static(path.join(__dirname, '../public'), {
    maxAge: isProduction ? ms('10d') : 0
}));

app.use(redirectRoute);

app.use(initi18n);
app.use(rootMiddleware);
app.use(homeRoute);
app.use(articlesRoute);

app.use(function (error: any, req: any, res: Response, _next: any) {
    catchError(req, res, error);
});

app.all('*', function (req, res) {
    var error: any = new Error('Page not found');
    error.statusCode = 404;
    catchError(req, res, error);
});

app.listen(process.env.PORT, () => {
    logger.warn('Listening at %s', process.env.PORT);
});

process.on('unhandledRejection', function (error: Error) {
    logger.error('unhandledRejection: ' + error.message, error);
});

process.on('uncaughtException', function (error: Error) {
    logger.error('uncaughtException: ' + error.message, error);
});
