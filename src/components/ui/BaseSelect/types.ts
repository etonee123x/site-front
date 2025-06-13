import type { Nil } from '@etonee123x/shared/types';
import type { TippyComponent } from 'vue-tippy';

export interface Props<Option, ModelValueSingle>
  extends Partial<{
    errorMessage: string;
    propsTippy: Pick<TippyComponent['$props'], 'appendTo'>;
    multiple: boolean;
    disabled: boolean;
    isLoading: boolean;
    readonly: boolean;
    placeholder: HTMLInputElement['placeholder'];
    label: string;
    optionToText: (option: Option) => string;
    optionToModelValue: (option: Option) => ModelValueSingle;
    selectedToText: (optionOrOptions: Option | Array<Option> | Nil) => string;
    isOptionSelected: (option: Option) => boolean;
    i18n: Record<'nothingFound', string | undefined>;
  }> {
  options: Array<Option>;
}
