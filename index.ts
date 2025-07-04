import 'dotenv/config';

import { readFile, access } from 'node:fs/promises';
import express, { type Request } from 'express';
import type { ViteDevServer } from 'vite';
import cookieParser from 'cookie-parser';
import { type render as Render } from './src/entryServer';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { resolve } from 'path';
import { pick } from '@etonee123x/shared/utils/pick';
import { postAuth } from './src/api/auth';
import { isProduction } from './src/constants/mode';
import { KEY_JWT } from './src/constants/keys';
import http from 'http';
import https from 'https';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import Cookies from 'universal-cookie';
import { type Locals } from './src/types';

// Constants
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction ? await readFile('./dist/client/index.html', 'utf-8') : '';

// Create http server
const app = express();

app.use(cookieParser());

let vite: ViteDevServer;

if (isProduction) {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
} else {
  const { createServer } = await import('vite');

  vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', base });
  app.use(vite.middlewares);
}

// Serve HTML
app.use(
  '*all',
  async (
    request: Request & {
      locals?: Locals;
    },
    response,
  ) => {
    try {
      const locals: Locals = pick(request, ['cookies']);

      request.locals = locals;
      const maybeJwt = request.query.token?.toString() ?? request.cookies[KEY_JWT];

      if (isNotNil(maybeJwt)) {
        await postAuth(maybeJwt)
          .then((_cookies) => {
            response.setHeader('Set-Cookie', _cookies);

            const cookies = new Cookies(_cookies.map((cookie) => cookie.split(';', 1)).join('; '));

            locals.cookies = {
              ...locals.cookies,
              ...cookies.getAll(),
            };
          })
          .catch(() => {
            response.clearCookie(KEY_JWT);
            delete locals.cookies?.[KEY_JWT];
          });
      }

      const url = request.originalUrl.replace(base, '');

      let template: string;
      let render: typeof Render;

      if (isProduction) {
        template = templateHtml;
        render = (await import('./dist/server/entryServer.js')).render;
      } else {
        // Always read fresh template in development
        template = await readFile('index.html', 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('./src/entryServer.ts')).render;
      }

      const initialSettings = JSON.parse(await readFile(resolve('./public/settings.json'), 'utf-8'));

      const settings = {
        ...initialSettings,
        ...pick(request.cookies, ['themeColor', 'language']),
      };

      locals.settings = settings;

      response.cookie('language', settings.language, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      response.cookie('themeColor', settings.themeColor, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      request.locals = locals;

      const rendered = await render(url, request);

      const html = await transformHtmlTemplate(
        rendered.head,
        template
          .replace(`<!--app-html-->`, rendered.html ?? '')
          .replace('<!--app-teleport-->', rendered.teleports['#teleported'] ?? ''),
      );

      response.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (error) {
      if (!(error instanceof Error)) {
        return console.error('Unknown error', error);
      }

      vite?.ssrFixStacktrace(error);
      console.error(error.stack);
      response.status(500).end(error.stack);
    }
  },
);

const pathToCert = process.env.PATH_TO_CERT;
const pathToKey = process.env.PATH_TO_KEY;

if (pathToCert && pathToKey) {
  Promise.all([
    access(pathToCert).then(() => readFile(pathToCert, 'utf-8')),
    access(pathToKey).then(() => readFile(pathToKey, 'utf-8')),
  ])
    .then(([cert, key]) => {
      https
        .createServer({ key, cert }, app)
        .once('listening', () => console.info(`HTTPS server is listening`))
        .listen(port)
        .on('error', (error) => console.error('Failed to start HTTPS server due to:', error));
    })
    .catch((error) => console.error('Failed to start HTTPS server due to:', error));
} else {
  console.warn('HTTPS server was not started because the certificate paths are missing');

  http
    .createServer(app)
    .once('listening', () => console.info(`HTTP server is listening`))
    .listen(port)
    .on('error', (error) => console.error('Failed to start HTTP server due to:', error));
}
