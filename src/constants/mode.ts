import { isServer } from '@/constants/target';

const mode = isServer ? process.env.NODE_ENV : import.meta.env.MODE;

export const isDevelopment = mode === 'development';

export const isProduction = mode === 'production';
