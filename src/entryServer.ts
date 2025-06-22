import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import type { Request } from 'express';
import { createHead } from '@unhead/vue/server';

export const render = async (url: string, request: Request) => {
  const { app, router } = createApp({ url });

  const head = createHead({
    init: [
      {
        link: [
          { rel: 'icon', href: '/favicon.ico' },
          { rel: 'stylesheet', type: 'text/css', href: '/src/assets/styles/index.css' },
        ],
      },
    ],
  });

  app.use(head);

  await router.isReady();

  const origin = `${request.protocol}://${request.get('host')}`;

  const context = {
    origin,
    settings: request.settings,
    payload: {},
  };

  const html = await renderToString(app, context);

  return { html, head, teleports: context };
};
