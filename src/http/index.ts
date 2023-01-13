export const get = (url: RequestInfo | URL, params?: RequestInit) =>
  fetch(url, params).then(async response => {
    if (!response.ok) {
      throw new Error();
    }
    return await response.json();
  });
