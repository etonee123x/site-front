import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import tailwindcss from '@tailwindcss/vite';
import VueDevTools from 'vite-plugin-vue-devtools';
import { ssrAutoKey } from './src/plugins/ssrAutoKey';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [VueDevTools(), vue(), ssrAutoKey(), VueI18nPlugin({}), tailwindcss()],
  publicDir: 'public',
});
