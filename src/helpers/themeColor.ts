import { ThemeColor } from '@/constants/settings';
import { THEME_COLOR } from '@/helpers/ui';
import { nonNullable } from '@/utils/nonNullable';
import { checkExhaustive } from '@etonee123x/shared/utils/checkExhaustive';

export const themeColorToThemeColorClass = (themeColor: ThemeColor) => {
  const colors = [
    THEME_COLOR.RED,
    THEME_COLOR.GREEN,
    THEME_COLOR.BLUE,
    THEME_COLOR.CYAN,
    THEME_COLOR.MAGENTA,
    THEME_COLOR.ORANGE,
  ];

  switch (themeColor) {
    case ThemeColor.Blue:
      return THEME_COLOR.BLUE;
    case ThemeColor.Cyan:
      return THEME_COLOR.CYAN;
    case ThemeColor.Green:
      return THEME_COLOR.GREEN;
    case ThemeColor.Magenta:
      return THEME_COLOR.MAGENTA;
    case ThemeColor.Orange:
      return THEME_COLOR.ORANGE;
    case ThemeColor.Red:
      return THEME_COLOR.RED;
    case ThemeColor.Random:
      return nonNullable(colors[Math.floor(Math.random() * colors.length)]);
    default:
      throw checkExhaustive(themeColor);
  }
};
