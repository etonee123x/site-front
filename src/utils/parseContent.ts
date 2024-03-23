export const parseContent = (content: string | undefined): string => {
  type FunctionReplacer = (content: string) => string;

  const replaceLinks: FunctionReplacer = (content) => {
    const URL_REGEXP = /(?<=\W|^)https?:\/\/(www\.)?[a-zA-Z0-9-:._/%]+(\?[-a-zA-Z0-9=]+(?=\W|$))?/;

    return content.replace(
      URL_REGEXP,
      (url) => `<a href="${url}" ${url.startsWith(window.location.origin) ? '' : 'target="_blank"'}>${url}</a>`,
    );
  };

  return [replaceLinks].reduce((acc, _function) => _function(acc), content ?? '');
};
