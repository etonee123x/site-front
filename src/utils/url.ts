export const getLastParameter = (url: string) => url.match(/(?<=\/)[^/]*$/gim)?.[0];

export const getFileUrlExtension = (url: string) => url.match(/\.[^.]*$/gim)?.[0];
