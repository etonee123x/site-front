export const getLastParameter = (url: string) => url.match(/(?<=\/)[^/]*$/gim)?.[0];
