import type { Id } from '@shared/src/types';
import { isNil } from '@shared/src/utils';
import { useClipboard } from '@vueuse/core';
import { toValue, type MaybeRefOrGetter } from 'vue';
import { useI18n } from 'vue-i18n';

import { useToastsStore } from '@/stores/toasts';

export const useCopyBlogPostURL = (postId: MaybeRefOrGetter<Id | undefined>) => {
  const { copy: _copy } = useClipboard({ legacy: true });

  const { t } = useI18n();

  const toastsStore = useToastsStore();

  const copy = async () => {
    const postIdValue = toValue(postId);

    if (isNil(postIdValue)) {
      return;
    }

    const locationURL = new URL(window.location.href);

    locationURL.searchParams.set('postId', String(postIdValue));

    return _copy(locationURL.href).then(() => toastsStore.toastSuccess(t('copied')));
  };

  return {
    copy,
  };
};
