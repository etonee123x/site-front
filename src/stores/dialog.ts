import type { Id } from '@etonee123x/shared/helpers/id';
import { defineStore } from 'pinia';
import { shallowReactive } from 'vue';

export const useDialogStore = defineStore('dialog', () => {
  const idsOpened = shallowReactive<Array<Id>>([]);

  const onOpen = (id: Id) => {
    if (idsOpened.includes(id)) {
      return;
    }

    idsOpened.push(id);
  };

  const getLastId = () => idsOpened.at(-1);

  const onClose = (id: Id) => {
    const index = idsOpened.indexOf(id);

    if (index === -1) {
      return;
    }

    idsOpened.splice(index, 1);
  };

  return {
    onOpen,
    getLastId,
    onClose,
  };
});
