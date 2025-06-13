import type { FolderData } from '@etonee123x/shared/types/folderData';

import { client } from '@/api/_client';

export const getFolderData = (url: string) => client<FolderData>(`/get-folder-data${url}`);
