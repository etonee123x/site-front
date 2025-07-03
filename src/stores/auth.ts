import { defineStore } from 'pinia';
import { computed, useSSRContext } from 'vue';

import { postAuth as _postAuth, deleteAuth as _deleteAuth } from '@/api/auth';
import { useAsyncStateApi } from '@/composables/useAsyncStateApi';
import { useCookies } from '@vueuse/integrations/useCookies.mjs';
import { isString } from '@etonee123x/shared/utils/isString';
import { isModeDevelopment, isServer } from '@/constants';
import { jsonParse } from '@etonee123x/shared/utils/jsonParse';
import { throwError } from '@etonee123x/shared/utils/throwError';
import { isRealObject } from '@etonee123x/shared/utils/isRealObject';

export const useAuthStore = defineStore('auth', () => {
  const cookies = useCookies(['jwt']);

  const { execute: postAuth, isLoading: isLoadingPostAuth } = useAsyncStateApi(_postAuth);
  const { execute: deleteAuth, isLoading: isLoadingDeleteAuth } = useAsyncStateApi(_deleteAuth);

  const isAdmin = computed(() => {
    const cookieJwt = isServer //
      ? (useSSRContext() ?? throwError()).request.cookies.jwt
      : cookies.get('jwt');

    if (!isString(cookieJwt)) {
      return false;
    }

    if (cookieJwt === 'dev-jwt' && isModeDevelopment) {
      return true;
    }

    const maybePayloadBase64 = cookieJwt.split('.')[1] ?? throwError();

    const parseBase64Payload =
      'atob' in globalThis ? globalThis.atob : (input: string) => Buffer.from(input, 'base64').toString('utf-8');

    const jwtParsed = jsonParse(parseBase64Payload(maybePayloadBase64));

    return isRealObject(jwtParsed) && 'isAdmin' in jwtParsed && jwtParsed.isAdmin === true;
  });

  return {
    postAuth,
    isLoadingPostAuth,

    deleteAuth,
    isLoadingDeleteAuth,

    isAdmin,
  };
});
