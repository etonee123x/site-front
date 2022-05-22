import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';
import pluginRewriteAll from 'vite-plugin-rewrite-all';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [vue(), eslint({ cache: true }), pluginRewriteAll()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
      @import "./src/assets/styles/mixins.scss";
      @import "./src/assets/styles/variables.scss";
    `,
      },
    },
  },
});
