import { createSSRApp } from 'vue';
import { createPinia, setActivePinia } from 'pinia';

import { createRouter } from '@/router';
import { i18n } from '@/i18n';
import App from '@/App.vue';
import { isNotNil } from '@etonee123x/shared/utils/isNotNil';

import { toTemporalInstant, type Temporal } from '@js-temporal/polyfill';

// TODO убрать после стабилизации Temporal и Intl.DurationFormat
declare global {
  interface Date {
    toTemporalInstant(): Temporal.Instant;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Intl {
    type DurationUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

    interface DurationRecord {
      years?: number;
      months?: number;
      weeks?: number;
      days?: number;
      hours?: number;
      minutes?: number;
      seconds?: number;
      milliseconds?: number;
      microseconds?: number;
      nanoseconds?: number;
    }

    interface DurationFormatOptions {
      style?: 'long' | 'short' | 'narrow' | 'digital';

      hours?: '2-digit' | 'numeric';
      minutes?: '2-digit' | 'numeric';
      seconds?: '2-digit' | 'numeric';

      yearsDisplay?: 'always' | 'auto';
      monthsDisplay?: 'always' | 'auto';
      weeksDisplay?: 'always' | 'auto';
      daysDisplay?: 'always' | 'auto';
      hoursDisplay?: 'always' | 'auto';
      minutesDisplay?: 'always' | 'auto';
      secondsDisplay?: 'always' | 'auto';

      fractionalDigits?: 0 | 1 | 2 | 3;
    }

    interface DurationFormatResolvedOptions extends DurationFormatOptions {
      locale?: string;
      numberingSystem?: string;
    }

    type DurationFormatPartType = 'literal' | 'integer';

    interface DurationFormatPart {
      type: DurationFormatPartType;
      value: string;
      unit?: DurationUnit;
    }

    type DurationInput = DurationRecord | Temporal.Duration;

    class DurationFormat {
      constructor(locales?: string | string[], options?: DurationFormatOptions);
      format(duration: DurationInput): string;
      formatToParts(duration: DurationInput): DurationFormatPart[];
      resolvedOptions(): DurationFormatResolvedOptions;
      static supportedLocalesOf(
        locales: string | string[],
        options?: { localeMatcher?: 'lookup' | 'best fit' },
      ): string[];
    }
  }
}

Date.prototype.toTemporalInstant = toTemporalInstant;

export const createApp = (context: Partial<{ url: string }> = {}) => {
  const app = createSSRApp(App);

  const pinia = createPinia();

  setActivePinia(pinia);
  app.use(pinia);

  const router = createRouter();

  app.use(router);

  if (isNotNil(context.url)) {
    router.push(context.url);
  }

  app.use(i18n);

  return { app, router, pinia, i18n };
};
