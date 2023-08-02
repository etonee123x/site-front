export enum THEME_COLOR {
  RANDOM = 'random',
  BLUE = 'blue',
  CYAN = 'cyan',
  GREEN = 'green',
  MAGENTA = 'magenta',
  RED = 'red',
  YELLOW = 'yellow',
}

export enum THEME_MODE {
  SYSTEM = 'system',
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Settings {
  themeColor: THEME_COLOR;
  themeMode: THEME_MODE;
}
