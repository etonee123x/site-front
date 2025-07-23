import type { FolderData, Item } from '@etonee123x/shared/helpers/folderData';

import { client } from '@/api/_client';

export interface WithSinceBirthtime {
  sinceBirthtime: number;
}

type ItemWithSinceTimestamps = Item & WithSinceBirthtime;

type FolderDataWithSinceTimestamps = Omit<FolderData, 'items'> & {
  items: Array<ItemWithSinceTimestamps>;
};

export const getFolderData = (url: string) => client<FolderDataWithSinceTimestamps>(`/get-folder-data${url}`);
