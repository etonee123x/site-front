import type { FolderData } from '@shared/src/types';

import { client } from '@/api/_client';

export const getFolderData = (url: string) => client<FolderData>(`/get-folder-data${url}`);
