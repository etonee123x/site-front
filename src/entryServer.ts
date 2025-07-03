import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import type { Request } from 'express';
import { createHead } from '@unhead/vue/server';
import type { Settings } from './constants/settings';
import { throwError } from '@etonee123x/shared/utils/throwError';

export const render = async (
  url: string,
  request: Request & {
    settings?: Settings;
  },
) => {
  const { app, router, pinia } = createApp({ url });

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
    request,
    settings: request.settings ?? throwError(),
    payload: {},
    teleports: {},
  };

  const html = await renderToString(app, context);

  head.push({
    script: [
      {
        innerHTML: `window.__PINIA__ = ${JSON.stringify(pinia.state.value)}`,
      },
      {
        innerHTML: `window.__PAYLOAD__ = ${JSON.stringify(context.payload)}`,
      },
    ],
  });

  return { html, head, teleports: context.teleports };
};
