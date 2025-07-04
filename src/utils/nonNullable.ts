import { isProduction } from '@/constants/mode';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';
import { throwError } from '@etonee123x/shared/utils/throwError';

export const nonNullable = <T>(parameter: T, _message?: string) => {
  const message = isProduction ? undefined : _message;

  if (isNotNil(message)) {
    console.error(message);
  }

  return parameter ?? throwError(message);
};
