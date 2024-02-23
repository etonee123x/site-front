import { intervalToDuration } from 'date-fns';

import { toId, type WithId } from '@/types';

export const formatDuration = (end: number): string => {
  const { minutes = 0, seconds = 0 } = intervalToDuration({ start: 0, end });

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const to0To1Borders = (currentValue: number, [minValue = 0, maxValue]: [number | undefined, number]) => {
  const result = (currentValue - minValue) / (maxValue - minValue);

  if (result > 1) {
    return 1;
  }

  if (result < 0) {
    return 0;
  }

  return result;
};

export const addId = <T>(el: T, id = Number(crypto.randomUUID().match(/[\d]/g)?.join(''))): WithId & T => ({
  ...el,
  id: toId(id),
});

export const getRandomExceptCurrentIndex = (to: number, currentValue: number): number => {
  if (to < 2) {
    return currentValue;
  }

  const newValue = Math.floor(Math.random() * to);

  if (newValue !== currentValue) {
    return newValue;
  }

  return getRandomExceptCurrentIndex(to, currentValue);
};
