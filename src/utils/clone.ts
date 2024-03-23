import { jsonParse } from '@shared/src/utils';

export const clone = <T>(argument: T): T => jsonParse<T>(JSON.stringify(argument));
