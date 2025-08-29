import { computed, toValue, type MaybeRefOrGetter } from 'vue';
import { useIntlRelativeTimeFormat } from './useIntlRelativeTimeFormat';

export const useRelativeDatetimeFormats = (_since: MaybeRefOrGetter<number>) => {
  const since = computed(() => Math.ceil(toValue(_since)));

  const intlRelativeTimeFormat = useIntlRelativeTimeFormat(...([, { numeric: 'auto' }] as const));

  const forHuman = computed(() => {
    const sign = Math.sign(since.value);
    const sinceAbsolute = Math.abs(since.value);

    const hours = Math.floor(sinceAbsolute / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    return days >= 1
      ? intlRelativeTimeFormat.value.format(days * sign, 'day')
      : intlRelativeTimeFormat.value.format(hours * sign, 'hour');
  });

  const forMachine = computed(() => new Date(Date.now() + since.value).toISOString());

  return {
    forHuman,
    forMachine,
  };
};
