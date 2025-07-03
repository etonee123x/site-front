import { isNil } from '@etonee123x/shared/utils/isNil';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';

export const isServer = isNil(globalThis.window);

export const isClient = isNotNil(globalThis.window);
