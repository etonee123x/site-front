import type { FolderData, Item, ItemFile } from '@etonee123x/shared/helpers/folderData';

import { client } from '@/api/_client';
import type { WithMeta, WithSinceTimestamps } from '@etonee123x/shared/types/database';

export type ItemWithSinceTimestamps<TItem extends Item> = TItem & WithMeta<WithSinceTimestamps>;

export type FolderDataWithSinceTimestamps = Omit<FolderData, 'items' | 'linkedFile'> & {
  items: Array<ItemWithSinceTimestamps<Item>>;
  linkedFile: ItemWithSinceTimestamps<ItemFile>;
};

export const getFolderData = (url: string) => client<FolderDataWithSinceTimestamps>(`/get-folder-data${url}`);
