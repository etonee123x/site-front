import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslint from 'vite-plugin-eslint';
import * as path from 'path';
import pluginRewriteAll from 'vite-plugin-rewrite-all';
import { readdirSync } from 'fs';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const getThemeMode = () => {
    return process.env.VITE_THEME_MODE ?? (Math.random() < 0.5 ? 'dark' : 'light');
  };

  const getThemeColor = () => {
    if (process.env.VITE_THEME_COLOR) return process.env.VITE_THEME_COLOR;

    const colorsTitle = readdirSync('./src/assets/styles/themes/colors');
    return colorsTitle[Math.floor(Math.random() * colorsTitle.length)];
  };

  const themeMode = getThemeMode();
  const themeColor = getThemeColor();

  // https://vitejs.dev/config/
  return defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
        @import "./src/assets/styles/themes/${themeMode}.scss";
        @import "./src/assets/styles/themes/colors/${themeColor}";
        @import "./src/assets/styles/mixins.scss";
        @import "./src/assets/styles/fonts.scss";
        @import "./src/assets/styles/variables.scss";
      `,
        },
      },
    },
    define: {
      'process.env': {} as { [key: string]: unknown },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@types': path.resolve(__dirname, './includes/types'),
      },
    },
    plugins: [vue(), eslint({ cache: true }), pluginRewriteAll()],
  });
};
