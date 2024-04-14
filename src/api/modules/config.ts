import { client } from '@/api/client';
import type { Settings } from '@/types';

export const getConfig = () => client<Settings>('/config.json', { baseURL: '' });
