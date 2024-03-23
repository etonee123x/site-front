import type { BufferSource } from 'node:stream/web';

import { isArray, isTruthy, isNil, isString } from '@shared/src/utils';
import { createError } from '@shared/src/types';

import type { ReplaceKeys } from '@/types';
import { TOKEN } from '@/constants';

type _FetchOptions = NonNullable<Parameters<typeof fetch>[1]>;

interface CustomOptions {
  isRelative: boolean;
}

type FetchOptions = ReplaceKeys<_FetchOptions, 'body', _FetchOptions['body'] | object> & Partial<CustomOptions>;

export class Client {
  static get = <Return>(url: string, options?: FetchOptions) =>
    Client.fetch<Return>(url, { method: 'GET', ...options });

  static post = <Input extends object, Return = Input>(url: string, body: Input, options?: FetchOptions) =>
    Client.fetch<Return>(url, { method: 'POST', body, ...options });

  static put = <Input extends object, Return = Input>(url: string, body: Input, options?: FetchOptions) =>
    Client.fetch<Return>(url, { method: 'PUT', body, ...options });

  static patch = <Input extends object, Return = Input>(url: string, body: Input, options?: FetchOptions) =>
    Client.fetch<Return>(url, { method: 'PATCH', body, ...options });

  static delete = <Return>(url: string, options?: FetchOptions) =>
    Client.fetch<Return>(url, { method: 'DELETE', ...options });

  private static fetch = async <T = void>(url: string, options: FetchOptions) => {
    const getOptions = (options: FetchOptions) => {
      const formHeaders = (headers: FetchOptions['headers']) => {
        const token = localStorage.getItem(TOKEN);

        const headersDefault = [
          ['Access-Control-Allow-Origin', '*'],
          ['Accept', 'application/json'],
          // TODO: менять в зависимости от body
          ['Content-Type', 'application/json'],
          token && ['Authorization', `Bearer ${token}`],
        ].filter(isTruthy);

        if (headers instanceof Headers) {
          const _headers = headers;

          headersDefault.forEach(([name, value]) => {
            if (isNil(name) || isNil(value)) {
              return;
            }

            _headers.append(name, value);
          });

          return _headers;
        }

        return {
          ...(isArray(headers) ? Object.fromEntries(headers) : headers),
          ...Object.fromEntries(headersDefault),
        };
      };

      const formBody = (body: FetchOptions['body']) => {
        const isBufferSource = <T>(arg: T | BufferSource): arg is BufferSource =>
          arg instanceof Uint8Array ||
          arg instanceof Uint16Array ||
          arg instanceof Uint32Array ||
          arg instanceof Uint8ClampedArray ||
          arg instanceof Int8Array ||
          arg instanceof Int16Array ||
          arg instanceof Int32Array ||
          arg instanceof Float32Array ||
          arg instanceof Float64Array ||
          arg instanceof ArrayBuffer;

        return isNil(body) ||
          body instanceof FormData ||
          body instanceof Blob ||
          body instanceof URLSearchParams ||
          isString(body) ||
          isBufferSource(body) ||
          body instanceof ReadableStream
          ? body
          : JSON.stringify(body);
      };

      return {
        ...options,
        headers: formHeaders(options.headers),
        body: formBody(options.body),
      };
    };

    return fetch(
      [!options.isRelative && import.meta.env.VITE_API_URL, url].filter(isTruthy).join(''),
      getOptions(options),
    ).then(async (r) => {
      if (r.status === 401) {
        localStorage.removeItem(TOKEN);
        window.location.href = '/';
      }

      const rJsoned = await r.json();

      if (!r.ok) {
        throw createError({ data: rJsoned, statusCode: r.status });
      }

      return rJsoned as T;
    });
  };
}
