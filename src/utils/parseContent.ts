import { isServer } from '@/constants/target';
import { requestToOrigin } from '@/utils/requestToOrigin';
import { nonNullable } from './nonNullable';
import { useSSRContext } from '@/composables/useSSRContext';

export const parseContent = (content: string | undefined): string => {
  type FunctionReplacer = (content: string) => string;

  const replaceLinks: FunctionReplacer = (content) => {
    const URL_REGEXP = /(?<=\W|^)https?:\/\/(www\.)?[a-zA-Z0-9-:._/%]+(\?[-a-zA-Z0-9=]+(?=\W|$))?/;

    const origin = isServer
      ? requestToOrigin(nonNullable(useSSRContext()).express.request)
      : globalThis.location.origin;

    return content.replace(
      URL_REGEXP,
      (url) => `<a href="${url}" ${url.startsWith(origin) ? '' : 'target="_blank"'}>${url}</a>`,
    );
  };

  return [replaceLinks].reduce((acc, _function) => _function(acc), content ?? '');
};
