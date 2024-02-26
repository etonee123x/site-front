import { intervalToDuration } from 'date-fns';
import { toId, type WithId } from '@shared/src/types';
import * as validators from '@vuelidate/validators';

import { i18n } from '@/i18n';

const { createI18nMessage } = validators;

const withI18nMessage = createI18nMessage({ t: i18n.global.t.bind(i18n) });

export const required = withI18nMessage(validators.required);

export const formatDuration = (end: number): string => {
  const { minutes = 0, seconds = 0 } = intervalToDuration({ start: 0, end });

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

export const to0To1Borders = (currentValue: number, [minValue = 0, maxValue]: [number | undefined, number]) =>
  Math.max(0, Math.min(1, (currentValue - minValue) / (maxValue - minValue)));

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
