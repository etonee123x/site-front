export enum THEME_COLOR {
  RANDOM = 'random',
  RED = 'red',
  GREEN = 'green',
  BLUE = 'blue',
  CYAN = 'cyan',
  MAGENTA = 'magenta',
  ORANGE = 'orange',
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
