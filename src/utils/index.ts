import { format, intervalToDuration } from 'date-fns';

export const removeSlashes = (text: string) => text.replace(/(?<!https:|http:)\/{2,}/g, '/');

export const getFormattedBirthTime = (birthTime: Date, dateTimeFormat = 'dd/MM/yyyy, HH:mm') =>
  format(new Date(birthTime), dateTimeFormat);

export const formatDuration = (duration: number | string): string => {
  const { minutes, seconds } = intervalToDuration({ start: 0, end: parseInt(duration.toString()) * 1000 });
  if (minutes === undefined) return '???';
  if (seconds === undefined) return '???';
  return `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
};

export const to0To1Borders = (currentValue: number, maxValue: number, minValue = 0) => {
  const result = (currentValue - minValue) / (maxValue - minValue);
  if (result > 1) return 1;
  if (result < 0) return 0;
  return result;
};
