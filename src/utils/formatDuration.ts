import { intervalToDuration } from 'date-fns';

export const formatDuration = (end: number): string => {
  const { minutes = 0, seconds = 0 } = intervalToDuration({ start: 0, end });

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};
