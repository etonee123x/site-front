import type { FolderData } from '@shared/src/types';

import { client } from '@/api/client';

export const getFolderData = (url: string) => client<FolderData>(`/get-folder-data${url}`);
