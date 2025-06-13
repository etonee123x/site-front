import { type MaybeRefOrGetter, type Ref, toValue } from 'vue';
import type { FunctionCallback } from '@etonee123x/shared/types';
import type { PostData } from '@etonee123x/shared/types/blog';
import { isNotEmptyArray } from '@etonee123x/shared/utils/isNotEmptyArray';
import { helpers } from '@vuelidate/validators';

import { i18n } from '@/i18n';
import { useVuelidateWithHandle } from '@/composables/useVuelidateWithHandle';

const validatorText = (filesUrls: Array<string>, files: MaybeRefOrGetter<Array<File>>) =>
  helpers.withMessage(
    () => i18n.global.t('validations.required'),
    (value: string) => isNotEmptyArray(filesUrls) || isNotEmptyArray(toValue(files)) || helpers.req(value),
  );

export const useVuelidateBlogPostData = (
  callback: FunctionCallback,
  postData: Ref<PostData>,
  files: MaybeRefOrGetter<Array<File>> = [],
) =>
  useVuelidateWithHandle(
    callback,
    {
      text: {
        required: validatorText(postData.value.filesUrls, files),
      },
    },
    postData,
    {
      $lazy: true,
    },
  );
