import { renderToString } from 'vue/server-renderer';
import { createApp } from './main';
import type { Request } from 'express';
import { createHead } from '@unhead/vue/server';
import type { Locals } from '@/types';

export const render = async (
  url: string,
  request: Request & {
    locals?: Locals;
  },
) => {
  const { app, router, pinia } = createApp({ url });

  const head = createHead();

  app.use(head);

  await router.isReady();

  const context = {
    request,
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
