import { Client } from '@/api/client';
import type { Settings } from '@/types';

export const getConfig = () => Client.get<Settings>('/config.json', { isRelative: true });
