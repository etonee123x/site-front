import { client } from '@/api/_client';

export enum ThemeColor {
  Random = 'Random',
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
  Cyan = 'Cyan',
  Magenta = 'Magenta',
  Orange = 'Orange',
}

export enum Language {
  Ru = 'Ru',
  En = 'En',
}

export interface Settings {
  themeColor: ThemeColor;
  language: Language;
}

export const getConfig = () => client<Settings>('/config.json', { baseURL: '' });
