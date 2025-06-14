const mode = import.meta.env.MODE;

export const isDevelopment = mode === 'development';

export const isProduction = mode === 'production';
