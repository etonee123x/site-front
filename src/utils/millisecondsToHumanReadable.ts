import { Temporal } from '@js-temporal/polyfill';

export const millisecondsToHumanReadable = (milliseconds: number): string => {
  const { minutes = 0, seconds = 0 } = Temporal.Duration.from({
    milliseconds: Math.ceil(milliseconds),
  }).round({
    largestUnit: 'minute',
    smallestUnit: 'second',
  });

  return [
    //
    minutes,
    String(seconds).padStart(2, '0'),
  ].join(':');
};
