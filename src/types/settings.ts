export enum ThemeColor {
  Random = 'Random',
  Red = 'Red',
  Green = 'Green',
  Blue = 'Blue',
  Cyan = 'Cyan',
  Magenta = 'Magenta',
  Orange = 'Orange',
}

export enum ThemeMode {
  System = 'System',
  Dark = 'Dark',
  Light = 'Light',
}

export enum Language {
  Ru = 'Ru',
  En = 'En',
}

export interface Settings {
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  language: Language;
}
