import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@types': resolve(__dirname, './submodules/types'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/styles/mixins/index.scss";',
      },
    },
  },
  plugins: [vue(), VueI18nPlugin({})],
  publicDir: 'public',
});
