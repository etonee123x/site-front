import { type Plugin } from 'vite';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';
import crypto from 'crypto';
import { parse as parseSFC } from '@vue/compiler-sfc';

export const ssrAutoKey = (): Plugin => ({
  name: 'vite:ssr-auto-key',
  enforce: 'pre',

  transform(_code, id) {
    if (!/\.(ts|js|vue)$/.test(id)) {
      return;
    }

    let code = _code;

    if (id.endsWith('.vue')) {
      const { descriptor } = parseSFC(_code);
      const script = descriptor.script?.content ?? descriptor.scriptSetup?.content;

      if (!script) {
        return;
      }
      code = script;
    }

    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx', 'decorators-legacy'],
    });

    let modified = false;

    traverse.default(ast, {
      CallExpression(path) {
        const callee = path.get('callee');

        if (!callee.isIdentifier({ name: 'useAsyncStateApi' })) {
          return;
        }

        const loc = path.node.loc?.start;
        const hash = crypto
          .createHash('md5')
          .update(id + JSON.stringify(loc))
          .digest('hex')
          .slice(0, 8);

        const firstArg = path.node.arguments[0];

        const isStringLiteral = t.isStringLiteral(firstArg);
        const isFunction = t.isArrowFunctionExpression(firstArg) || t.isFunctionExpression(firstArg);

        if (!isStringLiteral && !isFunction) {
          const keyLiteral = t.stringLiteral(`__SSRKEY__/${hash}`);

          path.node.arguments.unshift(keyLiteral);
        }

        modified = true;
      },
    });

    if (!modified) {
      return;
    }

    const output = generate.default(ast, {}, code);

    return { code: output.code, map: null };
  },
});
