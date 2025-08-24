import { renderToString } from 'vue/server-renderer';
import { createApp } from '@/main';
import { createHead } from '@unhead/vue/server';
import type { ExpressContext } from '@/constants/injectionKeyExpressContext';
import { isClient } from './constants/target';
import { type SSRContext } from '@/composables/useSSRContext';

export const render = async (url: string, expressContext: ExpressContext) => {
  const { app, router, pinia } = createApp({ url });

  app.config.errorHandler = () => {
    if (isClient || expressContext.response.headersSent) {
      return;
    }

    expressContext.response.redirect('/404');
  };

  const head = createHead();

  app.use(head);

  const context: SSRContext = {
    payload: {},
    teleports: {},
    express: expressContext,
  };

  return router
    .isReady()
    .then(() => renderToString(app, context))
    .then((html) => {
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

      return {
        html,
        head,
        teleports: context.teleports,
      };
    });
};
