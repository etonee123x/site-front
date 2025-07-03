import { isNil } from '@etonee123x/shared/utils/isNil';

export const KEY_JWT = 'jwt';

export const isServer = isNil(globalThis.window);

const mode = isServer ? process.env.NODE_ENV : import.meta.env.MODE;

export const isModeDevelopment = mode === 'development';
