import { client } from '@/api/_client';
import type { Settings } from '@/types';

export const getConfig = () => client<Settings>('/config.json', { baseURL: '' });
