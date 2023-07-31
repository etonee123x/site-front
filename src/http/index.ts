/* eslint-disable no-undef */

export const get = (url: RequestInfo | URL, params?: RequestInit) =>
  fetch(url, params).then(response => {
    if (!response.ok) {
      throw new Error();
    }

    return response.json();
  });
