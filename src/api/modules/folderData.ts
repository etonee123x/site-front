import type { FolderData } from '@shared/src/types';

import { Client } from '@/api/client';

export const getFolderData = (url: string) => Client.get<FolderData>(`/get-folder-data${url}`);
