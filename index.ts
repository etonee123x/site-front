import 'dotenv/config';

import { readFile } from 'node:fs/promises';
import express, { type Request } from 'express';
import type { ViteDevServer } from 'vite';
import cookieParser from 'cookie-parser';
import { type render as IRender } from './src/entryServer';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { resolve } from 'path';
import { pick } from '@etonee123x/shared/utils/pick';
import { type Settings } from './src/constants/settings';
import { postAuth } from './src/api/auth';
import { isString } from '@etonee123x/shared/utils/isString';
import { isProduction } from './src/constants/mode';

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
      settings?: Settings;
    },
    response,
  ) => {
    try {
      if (isString(request.query.token)) {
        const cookies = await postAuth(request.query.token);

        response.setHeader('Set-Cookie', cookies);
      }

      const url = request.originalUrl.replace(base, '');

      let template: string;
      let render: typeof IRender;

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

      request.settings = settings;

      response.cookie('language', settings.language, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      response.cookie('themeColor', settings.themeColor, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

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

// Start http server
app.listen(port, () => console.info(`Server started at http://localhost:${port}`));
