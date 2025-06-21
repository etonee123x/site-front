import { isMobile } from '@/helpers/isMobile';
import type { FunctionCallback } from '@etonee123x/shared/types';

export const onPostTextareaKeyDownEnter = (callback: FunctionCallback) => (e: KeyboardEvent) => {
  if (isMobile()) {
    return;
  }

  if (e.shiftKey || e.ctrlKey) {
    return;
  }

  e.preventDefault();

  callback();
};
