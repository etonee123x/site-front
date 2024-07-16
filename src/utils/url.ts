export const getLastParameter = (url: string) => url.match(/(?<=\/)[^/]*$/gim)?.[0];

export const getFileUrlExt = (url: string) => url.match(/\.[^.]*$/gim)?.[0];
