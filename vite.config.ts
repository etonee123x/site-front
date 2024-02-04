import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default () =>
  defineConfig({
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
    plugins: [vue()],
    publicDir: 'public',
  });
