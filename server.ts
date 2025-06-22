import { readFile } from 'node:fs/promises';
import express from 'express';
import { ViteDevServer } from 'vite';
import cookieParser from 'cookie-parser';
import { type render as IRender } from './src/entryServer';
import { transformHtmlTemplate } from '@unhead/vue/server';
import { resolve } from 'path';
import { pick } from '@etonee123x/shared/utils/pick';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction ? await readFile('./dist/client/index.html', 'utf-8') : '';

// Create http server
const app = express();

app.use(cookieParser());

let vite: ViteDevServer;

if (!isProduction) {
  const { createServer } = await import('vite');

  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import('compression')).default;
  const sirv = (await import('sirv')).default;

  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Serve HTML
app.use('*all', async (request, response) => {
  try {
    const url = request.originalUrl.replace(base, '');

    let template: string;
    let render: typeof IRender;

    if (!isProduction) {
      // Always read fresh template in development
      template = await readFile('index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entryServer.ts')).render;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entryServer.js')).render;
    }

    const initialSettings = JSON.parse(await readFile(resolve('./public/settings.json'), 'utf-8'));

    const settings = {
      ...initialSettings,
      ...pick(request.cookies, ['themeColor', 'language']),
    };

    request.settings = settings;

    response.cookie('language', settings.language, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });

    response.cookie('themeColor', settings.themeColor, {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });

    const rendered = await render(url, request);

    const html = await transformHtmlTemplate(rendered.head, template.replace(`<!--app-html-->`, rendered.html ?? ''));

    response.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.error(e.stack);
    response.status(500).end(e.stack);
  }
});

// Start http server
app.listen(port, () => console.info(`Server started at http://localhost:${port}`));
