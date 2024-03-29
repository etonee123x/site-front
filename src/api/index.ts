import type { FolderData } from '@shared/src/types';

import { get } from '@/api/client';
import type { Settings } from '@/types';

export const getFolderData = (url: string) =>
  get<FolderData>([import.meta.env.VITE_GET_FOLDER_DATA_ROUTE, url].join(''));

export const getConfig = () => get<Settings>('/config.json', { isRelative: true });
