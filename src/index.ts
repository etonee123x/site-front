import 'dotenv/config';

import { readFile, access } from 'node:fs/promises';
import express, { type Request } from 'express';
import type { ViteDevServer } from 'vite';
import cookieParser from 'cookie-parser';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { resolve } from 'path';
import { pick } from '@etonee123x/shared/utils/pick';
import { postAuth } from '@/api/auth';
import { isProduction } from '@/constants/mode';
import { KEY_JWT } from '@/constants/keys';
import http from 'http';
import https from 'https';
import { type Locals } from '@/types';
import { requestToOrigin } from '@/utils/requestToOrigin';
import { isNil } from '@etonee123x/shared/utils/isNil';

interface RequestWithLocals extends Request {
  locals?: Locals;
}

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
  async (request, response, next) => {
    // auth

    const maybeQueryJwt = request.query[KEY_JWT]?.toString();

    if (isNil(maybeQueryJwt)) {
      return next();
    }

    await postAuth(maybeQueryJwt)
      .then((cookies) => response.setHeader('Set-Cookie', cookies))
      .catch(() => response.clearCookie(KEY_JWT));

    const requestUrl = new URL(request.url, requestToOrigin(request));

    requestUrl.searchParams.delete(KEY_JWT);

    return response.redirect(requestUrl.toString());
  },
  async (request: RequestWithLocals, response, next) => {
    // settings

    const initialSettings = JSON.parse(await readFile(resolve('./public/settings.json'), 'utf-8'));

    const settings = {
      ...initialSettings,
      ...pick(request.cookies, ['themeColor', 'language']),
    };

    const locals: Locals = {
      settings,
    };

    response.cookie('language', settings.language, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    response.cookie('themeColor', settings.themeColor, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    request.locals = locals;

    next();
  },
  async (request: RequestWithLocals, response) => {
    try {
      const url = request.originalUrl.replace(base, '');

      let template: string;
      let render;

      if (isProduction) {
        template = templateHtml;
        render = (await import('../dist/server/entryServer.js')).render;
      } else {
        // Always read fresh template in development
        template = await readFile('index.html', 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        render = (await vite.ssrLoadModule('./entryServer.ts')).render;
      }

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
