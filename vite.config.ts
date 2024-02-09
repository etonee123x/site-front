import { resolve } from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import ViteYaml from '@modyfi/vite-plugin-yaml';

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
  plugins: [vue(), VueI18nPlugin({}), ViteYaml({ exclude: '**/*.vue*' })],
  publicDir: 'public',
});
