import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

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
    plugins: [vue(), pluginRewriteAll()],
    publicDir: 'public',
  });
