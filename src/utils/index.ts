import { format, intervalToDuration } from 'date-fns';

import { WithId } from '@/types';

export const createURL = (...parts: string[]) =>
  parts
    .map(part => part.replace(/^\/+|\/+$/, ''))
    .filter(Boolean)
    .join('/');

export const getFormattedBirthTime = (birthTime: string, dateTimeFormat = 'dd/MM/yyyy, HH:mm') =>
  format(new Date(birthTime), dateTimeFormat);

export const formatDuration = (duration: number): string => {
  const { minutes, seconds } = intervalToDuration({ start: 0, end: duration * 1000 });
  return minutes === undefined || seconds === undefined ? '???' : `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const to0To1Borders = (currentValue: number, maxValue: number, minValue = 0) => {
  const result = (currentValue - minValue) / (maxValue - minValue);
  if (result > 1) return 1;
  if (result < 0) return 0;
  return result;
};

export const addId = <T>(
  el: T,
  id = Number(crypto.randomUUID().match(/[\d]/g)?.join('')),
): WithId<T> => ({ ...el, id });
