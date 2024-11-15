import { jsonParse } from '@shared/src/utils/jsonParse';

export const clone = <T>(argument: T): T => jsonParse.unsafe<T>(JSON.stringify(argument));
